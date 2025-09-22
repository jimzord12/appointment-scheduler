import { create } from 'zustand';

import { getLanguage, setLanguage, type Language } from '../lib/i18n/index.js';
import { getThemeMode, setThemeMode, type ThemeMode } from '../lib/theme/index.js';

export interface PreferencesState {
  theme: ThemeMode;
  language: Language;
  motion: 'default' | 'reduced';
  setTheme: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  setMotion: (pref: 'default' | 'reduced') => void;
  hydrateFromDevice: () => void;
}

export const preferencesStore = create<PreferencesState>(set => ({
  theme: 'system',
  language: 'en',
  motion: 'default',
  setTheme: mode => {
    set({ theme: mode });
    setThemeMode(mode);
  },
  setLanguage: lang => {
    set({ language: lang });
    setLanguage(lang);
  },
  setMotion: pref => set({ motion: pref }),
  hydrateFromDevice: () => {
    set({ theme: getThemeMode(), language: getLanguage() });
  },
}));

export type PreferencesStore = typeof preferencesStore;
