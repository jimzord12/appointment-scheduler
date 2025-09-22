import { applyPalette, type ThemeMode } from './tokens.js';
export type { ThemeMode } from './tokens.js';

const STORAGE_KEY = 'app.themeMode';

export function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getThemeMode(): ThemeMode {
  const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system';
  return saved;
}

export function setThemeMode(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
}

export function applyTheme(mode: ThemeMode) {
  const isDark = mode === 'dark' || (mode === 'system' && getSystemPrefersDark());
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  applyPalette(isDark);
}

export function initThemeFromCache() {
  const mode = getThemeMode();
  applyTheme(mode);
}
