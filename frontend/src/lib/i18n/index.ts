import el from './el.json' with { type: 'json' };
import en from './en.json' with { type: 'json' };

export type Language = 'en' | 'el';
const STORAGE_KEY = 'app.language';

const dict: Record<Language, Record<string, string>> = { en, el } as const;
let current: Language = 'en';
const listeners = new Set<() => void>();

export function setLanguage(lang: Language) {
  current = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach(l => l());
}

export function initI18nFromCache() {
  const saved = (localStorage.getItem(STORAGE_KEY) as Language | null) ?? 'en';
  current = saved;
}

export function t(key: string): string {
  const table = dict[current] ?? dict.en;
  return table[key] ?? key;
}

export function getLanguage(): Language {
  return current;
}

export function subscribeI18n(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
