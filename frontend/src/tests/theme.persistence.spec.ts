import { describe, it, expect, beforeEach } from 'vitest';

import { initThemeFromCache, setThemeMode } from '../lib/theme/index.js';

describe('T007 Theme persistence', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('persists dark mode across reloads', () => {
    setThemeMode('dark');
    // Simulate reload by reinitializing
    document.documentElement.classList.remove('dark');
    initThemeFromCache();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
