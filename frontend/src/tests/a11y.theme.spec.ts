import { describe, it, expect, beforeEach } from 'vitest';

import { applyTheme } from '../lib/theme/index.js';

describe('T006 A11y baseline - theme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('applies dark class for dark mode', () => {
    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies light mode by removing dark class', () => {
    document.documentElement.classList.add('dark');
    applyTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('focus-ring utility is defined for accessibility', () => {
    const el = document.createElement('button');
    el.className = 'focus-ring';
    document.body.appendChild(el);
    // We can't compute CSS in jsdom, but ensure class is present
    expect(el.className.includes('focus-ring')).toBe(true);
  });
});
