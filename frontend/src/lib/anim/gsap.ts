export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function fadeIn(el: Element, opts: { duration?: number; y?: number } = {}) {
  if (prefersReducedMotion()) return; // skip anim
  const { duration = 0.6, y = 10 } = opts;
  import('gsap').then(({ gsap }) => {
    gsap.fromTo(el, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, ease: 'power2.out' });
  });
}
