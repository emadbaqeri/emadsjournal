export type ThemePreference = 'dark' | 'light' | 'system';

export const THEME_STORAGE_KEY = 'emaaad-theme';

export const THEME_ORDER: readonly ThemePreference[] = [
  'dark',
  'light',
  'system',
];

export function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'system' || stored === 'dark') {
      return stored;
    }
  } catch {
    /* localStorage can throw in privacy modes */
  }
  return 'dark';
}

export function resolveTheme(pref: ThemePreference): 'dark' | 'light' {
  if (pref === 'light') return 'light';
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }
  return 'dark';
}

export function applyTheme(pref: ThemePreference): void {
  const theme = resolveTheme(pref);
  const root = document.documentElement;
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  root.style.colorScheme = theme;
}

export function persistTheme(pref: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* localStorage can throw in privacy modes */
  }
  applyTheme(pref);
}

export function cycleTheme(current: ThemePreference): ThemePreference {
  const index = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(index + 1) % THEME_ORDER.length];
}
