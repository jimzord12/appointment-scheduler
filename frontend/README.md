# Frontend UI Guide

This document summarizes the Modern Fluid UI features implemented in the frontend and how to use/test them.

## Theme (Light/Dark/System)

- Toggle via `Theme` switch in the header.
- Modes: `light`, `dark`, `system` (follows OS).
- State is persisted using the `preferencesStore` (local storage for anonymous users; per-user when signed in).

## Language (EN/EL)

- Switch using the `Language` control in the header.
- Translations live under `src/lib/i18n/*.json` with runtime updates (no reload required).
- The application title and other UI elements react immediately.

## Reduced Motion

- `Settings` panel includes a `Reduced motion` toggle.
- When enabled, animation utilities honor the preference and skip/simplify animations.
- System-level `prefers-reduced-motion` is respected, but the user toggle overrides it when set.

## Animations

- Implemented with GSAP and light wrappers under `src/lib/anim/`.
- Utilities are lazy-loaded and scheduled in idle time; duration is simplified when under heavy load.

## Testing

- Unit and integration tests: `pnpm -C frontend test`
- E2E tests: `pnpm -C frontend test:e2e`
- Accessibility tests are included (axe-core) for theme, controls, and key pages.

## Dev Notes

- Tech: React 19 + Vite + TS + TailwindCSS 4.
- State: Zustand for user/device preferences.
- Router: TanStack Router. Prefer testing leaf components if Router context is not needed.
