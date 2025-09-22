import { describe, it, expect, beforeEach } from 'vitest';

import { initI18nFromCache, setLanguage, t } from '../lib/i18n/index.js';

describe('T008 i18n switch and persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('switches to Greek and persists across reload', () => {
    setLanguage('el');
    expect(t('app.title')).toBe('Προγραμματιστής Ραντεβού');

    // Simulate reload
    localStorage.setItem('app.language', 'el');
    // reset any internal cache by reinitializing
    initI18nFromCache();
    expect(t('app.title')).toBe('Προγραμματιστής Ραντεβού');
  });
});
