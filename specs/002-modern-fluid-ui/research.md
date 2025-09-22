# Research: Modern Fluid UI (Themes, i18n, Animations)

## Decisions

- TailwindCSS v4.1 for utility-first styling and responsive, mobile-first design.
- shadcn UI v3.3 components for accessible, composable primitives consistent across themes.
- tweakcn for theme tokens/variants and light/dark theme management.
- GSAP for smooth, performant in-view animations; respect prefers-reduced-motion.
- Mobile-first requirement: all layouts, spacing, and components optimized for small screens first.

## Rationale

- Tailwind v4.1 aligns with utility-first workflow, reduces CSS bloat, and eases theming with tokens.
- shadcn UI provides accessible components that fit well with Tailwind and design tokens.
- tweakcn simplifies managing light/dark tokens without complex custom CSS variables.
- GSAP offers robust control and performance for scroll/in-view animations beyond simple CSS transitions.
- Mobile-first ensures best experience on smartphones, our primary target form factor.

## Alternatives Considered

- CSS-only animations or Framer Motion: simpler but less control over sequencing and scroll-based triggers compared to GSAP.
- Headless UI or Radix UI: solid, but shadcn's patterns align better with Tailwind + token-driven theming.
- Custom theming via CSS variables only: flexible but more manual wiring vs tweakcn.

## References

- WCAG AA contrast requirements
- prefers-reduced-motion media query behavior
- i18n locale formatting for dates/times (EN/EL)
