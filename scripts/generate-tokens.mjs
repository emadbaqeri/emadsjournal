#!/usr/bin/env node
/**
 * Generates src/tokens/tokens.css from src/tokens/tokens.json.
 * Run: node scripts/generate-tokens.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokensPath = path.join(root, 'src/tokens/tokens.json');
const outPath = path.join(root, 'src/tokens/tokens.css');

const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

function cssName(collectionName, varName) {
  const kebab = varName.replaceAll('/', '-');
  if (collectionName === 'Primitives') return `--primitives-${kebab}`;
  return `--${kebab}`;
}

function roundNumber(n) {
  if (Number.isInteger(n)) return String(n);
  return String(Math.round(n * 1000) / 1000);
}

function floatCss(varName, value) {
  if (varName.startsWith('line-height/')) return roundNumber(value);
  if (varName.includes('duration/')) return `${roundNumber(value)}ms`;
  return `${roundNumber(value)}px`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const byId = new Map();
for (const col of data.collections) {
  for (const v of col.variables) {
    byId.set(v.id, {
      collectionName: col.name,
      name: v.name,
      css: cssName(col.name, v.name),
    });
  }
}

function serialize(val, varName) {
  if (val == null) {
    throw new Error(`Missing value for ${varName}`);
  }
  if (typeof val === 'string') {
    if (val.startsWith('#') || val.startsWith('cubic-bezier(')) return val;
    return JSON.stringify(val);
  }
  if (typeof val === 'number') return floatCss(varName, val);
  if (val.hex && val.alpha != null) return hexToRgba(val.hex, val.alpha);
  if (val.alias) {
    const target = byId.get(val.alias);
    if (!target) {
      throw new Error(`Unknown alias ${val.alias} (${val.aliasName}) for ${varName}`);
    }
    return `var(${target.css})`;
  }
  throw new Error(`Cannot serialize ${varName}: ${JSON.stringify(val)}`);
}

function decls(col, modeId) {
  return col.variables.map((v) => {
    const value = serialize(v.valuesByMode[modeId], v.name);
    return `  ${cssName(col.name, v.name)}: ${value};`;
  });
}

function mustFind(name) {
  const col = data.collections.find((c) => c.name === name);
  if (!col) throw new Error(`Missing collection ${name}`);
  return col;
}

function modeId(col, modeName) {
  const mode = col.modes.find((m) => m.name === modeName);
  if (!mode) throw new Error(`Missing mode ${modeName} on ${col.name}`);
  return mode.id;
}

const primitives = mustFind('Primitives');
const color = mustFind('Color');
const track = mustFind('Track');
const spacing = mustFind('Spacing');
const radius = mustFind('Radius');
const type = mustFind('Type');
const motion = mustFind('Motion');

function typeClass(name) {
  return `.text-${name.toLowerCase().replaceAll('/', '-')}`;
}

function typeRules() {
  const typeSizeByPx = new Map();
  for (const v of type.variables) {
    if (v.name.startsWith('font-size/')) {
      typeSizeByPx.set(v.valuesByMode[type.defaultModeId], cssName('Type', v.name));
    }
  }

  return data.textStyles
    .map((s) => {
      const cls = typeClass(s.name);
      const family = s.fontName.family === 'Inter' ? 'var(--font-sans)' : 'var(--font-mono)';
      const weight = s.fontName.variationSettings?.wght ?? 400;
      const lh =
        s.lineHeight.unit === 'PERCENT'
          ? roundNumber(s.lineHeight.value / 100)
          : String(s.lineHeight.value);
      const ls =
        s.letterSpacing.value === 0 ? '0' : `${roundNumber(s.letterSpacing.value)}px`;
      const extra = s.textCase === 'UPPER' ? '\n  text-transform: uppercase;' : '';
      const sizeToken = typeSizeByPx.get(s.fontSize);
      const size = sizeToken ? `var(${sizeToken})` : `${s.fontSize}px`;
      return `${cls} {
  font-family: ${family};
  font-size: ${size};
  font-weight: ${weight};
  line-height: ${lh};
  letter-spacing: ${ls};${extra}
}`;
    })
    .join('\n\n');
}

const shiki = `  --astro-code-foreground: var(--color-code-text);
  --astro-code-background: var(--color-bg-code);
  --astro-code-token-constant: var(--color-code-number);
  --astro-code-token-string: var(--color-code-string);
  --astro-code-token-comment: var(--color-code-comment);
  --astro-code-token-keyword: var(--color-code-keyword);
  --astro-code-token-parameter: var(--color-code-text);
  --astro-code-token-function: var(--color-code-function);
  --astro-code-token-string-expression: var(--color-code-string);
  --astro-code-token-punctuation: var(--color-code-muted);
  --astro-code-token-link: var(--color-code-keyword);`;

const css = `/* Generated from src/tokens/tokens.json. Do not edit by hand. */

:root {
  color-scheme: dark;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --track-cs: var(--color-terminal-fg);
  --track-security: var(--color-accent-default);
${decls(primitives, primitives.defaultModeId).join('\n')}
${decls(spacing, spacing.defaultModeId).join('\n')}
${decls(radius, radius.defaultModeId).join('\n')}
${decls(type, type.defaultModeId).join('\n')}
${decls(motion, motion.defaultModeId).join('\n')}
${decls(color, modeId(color, 'Dark')).join('\n')}
${shiki}
}

html[data-theme="light"] {
  color-scheme: light;
${decls(color, modeId(color, 'Light')).join('\n')}
}

[data-track="cs"] {
${decls(track, modeId(track, 'CS')).join('\n')}
}

[data-track="security"] {
${decls(track, modeId(track, 'Security')).join('\n')}
}

${typeRules()}
`;

fs.writeFileSync(outPath, css);
console.log(`Wrote ${path.relative(root, outPath)}`);
