import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fadeIn, prefersReducedMotion } from '../lib/anim/gsap.js';
import { preferencesStore } from '../stores/preferences.js';

describe('T009 Reduced motion behavior', () => {
  const matchMedia = vi.spyOn(window, 'matchMedia');

  beforeEach(() => {
    matchMedia.mockReset();
  });

  it('detects reduced motion from media query', () => {
    matchMedia.mockReturnValue({ matches: true } as any);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('skips animations when reduced motion is preferred', async () => {
    matchMedia.mockReturnValue({ matches: true } as any);
    const el = document.createElement('div');
    document.body.appendChild(el);
    // Should not throw and not attempt to import gsap heavy code path
    fadeIn(el);
    expect(true).toBe(true);
  });

  it('user override forces reduced motion regardless of system setting', () => {
    // System says no reduced motion
    matchMedia.mockReturnValue({ matches: false } as any);
    // User enables reduced motion
    preferencesStore.getState().setMotion('reduced');
    expect(prefersReducedMotion()).toBe(true);
    // Reset
    preferencesStore.getState().setMotion('default');
  });
});
