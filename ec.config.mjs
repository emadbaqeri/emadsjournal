import { defineEcConfig, pluginFramesTexts } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import emadDark from './src/styles/code-themes/emad-dark.json' with { type: 'json' };
import emadLight from './src/styles/code-themes/emad-light.json' with { type: 'json' };
import { pluginCodeChrome, pluginShortSnippets } from './src/lib/code-plugins.mjs';

// Accessible name is "Copy code"; the polite live region says "Copied".
// The frames script keeps that message up for 1.5s. src/lib/code-copy.ts
// hides it at 1.2s so the visible confirmation matches the rest of the site.
pluginFramesTexts.overrideTexts(undefined, {
  copyButtonTooltip: 'Copy code',
  copyButtonCopied: 'Copied',
});

const shellLangs = [
  'ansi',
  'bash',
  'bat',
  'batch',
  'cmd',
  'console',
  'powershell',
  'ps',
  'ps1',
  'sh',
  'shell',
  'shellscript',
  'shellsession',
  'zsh',
].join(',');

export default defineEcConfig({
  themes: [emadDark, emadLight],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => (theme.type === 'light' ? '[data-theme="light"]' : false),
  // Keep the authored palette. The default 5.5 contrast pass rewrites it.
  minSyntaxHighlightingColorContrast: 0,
  useThemedSelectionColors: true,
  // Zig ships in the full Shiki bundle. Leaving bundledLangs unset keeps it loaded.
  plugins: [pluginShortSnippets(), pluginLineNumbers(), pluginCodeChrome()],
  defaultProps: {
    showLineNumbers: true,
    wrap: false,
    overridesByLang: {
      [shellLangs]: {
        showLineNumbers: false,
        frame: 'terminal',
      },
    },
  },
  styleOverrides: {
    borderColor: 'var(--color-code-border)',
    borderRadius: 'var(--radius-md)',
    borderWidth: '1px',
    codeBackground: 'var(--color-code-bg)',
    codeForeground: 'var(--color-code-text)',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: '.875rem',
    codeLineHeight: 'var(--line-height-code)',
    codePaddingBlock: '.75rem',
    codePaddingInline: '1rem',
    codeSelectionBackground: 'var(--color-code-selection)',
    focusBorder: 'var(--color-code-keyword)',
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: '.75rem',
    uiFontWeight: '500',
    gutterForeground: 'var(--color-code-line-number)',
    gutterHighlightForeground: 'var(--color-code-line-number-active)',
    frames: {
      shadowColor: 'transparent',
      frameBoxShadowCssValue: 'none',
      editorBackground: 'var(--color-code-bg)',
      terminalBackground: 'var(--color-code-bg)',
      editorTabBarBackground: 'var(--color-code-header-bg)',
      editorActiveTabBackground: 'var(--color-code-header-bg)',
      terminalTitlebarBackground: 'var(--color-code-header-bg)',
      editorTabBarBorderColor: 'var(--color-code-border)',
      editorTabBarBorderBottomColor: 'var(--color-code-border)',
      terminalTitlebarBorderBottomColor: 'var(--color-code-border)',
      editorActiveTabForeground: 'var(--color-code-text)',
      editorActiveTabBorderColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorActiveTabIndicatorHeight: '0',
      editorTabBorderRadius: '0',
      terminalTitlebarForeground: 'var(--color-code-comment)',
      terminalTitlebarDotsForeground: 'transparent',
      terminalTitlebarDotsOpacity: '0',
      tooltipSuccessBackground: 'var(--color-code-diff-ins-bg)',
      tooltipSuccessForeground: 'var(--color-code-string)',
    },
    textMarkers: {
      backgroundOpacity: '100%',
      markBackground: 'var(--color-code-marked-bg)',
      markBorderColor: 'var(--color-code-marked-bar)',
      insBackground: 'var(--color-code-diff-ins-bg)',
      insBorderColor: 'var(--color-code-diff-ins-marker)',
      insDiffIndicatorColor: 'var(--color-code-diff-ins-marker)',
      delBackground: 'var(--color-code-diff-del-bg)',
      delBorderColor: 'var(--color-code-diff-del-marker)',
      delDiffIndicatorColor: 'var(--color-code-diff-del-marker)',
      lineMarkerAccentWidth: '.1875rem',
      lineDiffIndicatorMarginLeft: '.25rem',
    },
    lineNumbers: {
      foreground: 'var(--color-code-line-number)',
      highlightForeground: 'var(--color-code-line-number-active)',
    },
  },
});
