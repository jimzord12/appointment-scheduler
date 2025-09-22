export type ThemeMode = 'light' | 'dark' | 'system';

export const lightPalette = {
  bg: '255 255 255',
  fg: '17 24 39',
  muted: '107 114 128',
  primary: '29 78 216',
  ring: '59 130 246',
};

export const darkPalette = {
  bg: '17 24 39',
  fg: '243 244 246',
  muted: '156 163 175',
  primary: '96 165 250',
  ring: '59 130 246',
};

export function applyPalette(isDark: boolean) {
  const root = document.documentElement;
  const palette = isDark ? darkPalette : lightPalette;
  for (const [k, v] of Object.entries(palette)) {
    root.style.setProperty(`--${k}`, v);
  }
}
