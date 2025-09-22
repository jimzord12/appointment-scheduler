import { create } from 'zustand';

import { getLanguage, setLanguage, type Language } from '../lib/i18n/index.js';
import { loadPreferences, savePreferences } from '../lib/persistence.js';
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
    savePreferences({ theme: mode });
  },
  setLanguage: lang => {
    set({ language: lang });
    setLanguage(lang);
    savePreferences({ language: lang });
  },
  setMotion: pref => {
    set({ motion: pref });
    savePreferences({ motion: pref });
  },
  hydrateFromDevice: () => {
    const p = loadPreferences();
    set({
      theme: p.theme ?? getThemeMode(),
      language: p.language ?? getLanguage(),
      motion: p.motion ?? 'default',
    });
  },
}));

export type PreferencesStore = typeof preferencesStore;
