import { fadeIn, prefersReducedMotion } from './gsap.js';

export function observeInView(el: Element, options: IntersectionObserverInit = { threshold: 0.1 }) {
  if (prefersReducedMotion())
    return { disconnect: () => void 0 } as Pick<IntersectionObserver, 'disconnect'>;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fadeIn(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, options);
  io.observe(el);
  return io;
}
