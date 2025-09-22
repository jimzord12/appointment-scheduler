import { preferencesStore } from '../../stores/preferences.js';

type GsapModule = { gsap: { fromTo: (el: Element, from: object, to: object) => void } };

// Cache GSAP dynamic import to avoid repeated module fetch and initialization
let gsapPromise: Promise<GsapModule> | null = null;
function getGsap() {
  if (!gsapPromise) {
    gsapPromise = import('gsap');
  }
  return gsapPromise;
}

// Use idle scheduling to avoid blocking input/paint; fallback to setTimeout when unavailable
function schedule(fn: () => void) {
  const g = globalThis as unknown as { requestIdleCallback?: (cb: () => void) => number };
  if (typeof g.requestIdleCallback === 'function') {
    g.requestIdleCallback(fn);
  } else {
    setTimeout(fn, 0);
  }
}

export function prefersReducedMotion() {
  // User preference overrides system
  try {
    const motion = preferencesStore.getState().motion;
    if (motion === 'reduced') return true;
  } catch {
    // store might not be initialized in some test environments
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

let activeAnimations = 0;
export function fadeIn(el: Element, opts: { duration?: number; y?: number } = {}) {
  if (prefersReducedMotion()) return; // skip anim
  const { duration = 0.6, y = 10 } = opts;
  // Simple concurrency-aware duration adjustment to keep frames smooth under load
  const adjustedDuration = Math.max(0.2, duration - Math.min(activeAnimations * 0.05, 0.3));
  schedule(() => {
    activeAnimations++;
    getGsap()
      .then(({ gsap }) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y },
          { autoAlpha: 1, y: 0, duration: adjustedDuration, ease: 'power2.out' }
        );
      })
      .finally(() => {
        activeAnimations = Math.max(0, activeAnimations - 1);
      });
  });
}
