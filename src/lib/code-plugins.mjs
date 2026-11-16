/**
 * Expressive Code plugins for the journal's code chrome.
 * Short snippets drop line numbers. Visible headers gain a language label,
 * and the built-in copy button moves into that bar.
 */

const SNIPPET_LINE_MAX = 3;

function classNames(node) {
  const value = node?.properties?.className ?? node?.properties?.class;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  return [];
}

function hasClass(node, name) {
  return classNames(node).includes(name);
}

function findElement(node, match) {
  if (!node || typeof node !== 'object') return undefined;
  if (node.type === 'element' && match(node)) return node;
  if (!Array.isArray(node.children)) return undefined;
  for (const child of node.children) {
    const found = findElement(child, match);
    if (found) return found;
  }
  return undefined;
}

export function pluginShortSnippets() {
  return {
    name: 'Short snippets',
    hooks: {
      preprocessMetadata({ codeBlock }) {
        const count = codeBlock.getLines().length;
        if (count > 0 && count <= SNIPPET_LINE_MAX) {
          codeBlock.props.showLineNumbers = false;
        }
      },
    },
  };
}

export function pluginCodeChrome() {
  return {
    name: 'Code chrome',
    hooks: {
      postprocessRenderedBlock({ codeBlock, renderData }) {
        const figure = renderData.blockAst;
        if (!figure || figure.type !== 'element' || figure.tagName !== 'figure') return;
        const header = findElement(
          figure,
          (node) => node.tagName === 'figcaption' && hasClass(node, 'header'),
        );
        if (!header) return;
        const visible = hasClass(figure, 'has-title') || hasClass(figure, 'is-terminal');
        if (!visible) return;

        const language = codeBlock.language?.trim();
        if (language) {
          header.children.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['lang'] },
            children: [{ type: 'text', value: language }],
          });
        }

        const copy = findElement(figure, (node) => node.tagName === 'div' && hasClass(node, 'copy'));
        if (copy && Array.isArray(figure.children)) {
          figure.children = figure.children.filter((child) => child !== copy);
          header.children.push(copy);
          const button = findElement(copy, (node) => node.tagName === 'button');
          if (button) {
            button.properties = {
              ...button.properties,
              type: 'button',
              ariaLabel: 'Copy code',
              title: 'Copy code',
            };
          }
        }
      },
    },
  };
}
