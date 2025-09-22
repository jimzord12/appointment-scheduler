# Tasks: Modern Fluid UI (Themes, i18n, Animations)

**Input**: Design documents from `specs/002-modern-fluid-ui/`
**Prerequisites**: plan.md (required), research.md, data-model.md, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Extract: tech stack, libraries, constraints (mobile-first, WCAG, reduced motion)
2. Load optional design documents:
   → data-model.md: DisplayPreferences entity
   → research.md: decisions on Tailwind 4.1, shadcn 3.3, tweakcn, GSAP
   → quickstart.md: integration scenarios
3. Generate tasks by category:
   → Setup: dependencies, configs, linting
   → Tests: a11y & integration tests first (TDD)
   → Core: theming, i18n, animation scaffolding
   → Integration: persistence and global controls
   → Polish: performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph & parallel examples
```

## Phase 3.1: Setup

- [x] T001 Setup TailwindCSS v4.1 in `frontend/` (config, PostCSS if needed, import styles, remove old CSS)
  - Files: `frontend/tailwind.config.ts`, `frontend/src/main.tsx`, `frontend/src/index.css`
  - Notes: Mobile-first; generate light/dark tokens via tweakcn later
- T002 Install shadcn UI v3.3 and initialize base components set
  - Files: `frontend/` (component generation per shadcn CLI)
  - Notes: Buttons, inputs, dialogs, nav primitives
- T003 Install and configure tweakcn for theme tokens/variants
  - Files: `frontend/src/lib/theme/tokens.ts`, `frontend/src/lib/theme/index.ts`
  - Notes: Define light/dark palettes; map to Tailwind via CSS vars if needed
- [x] T004 Add GSAP for animations; create animation utilities
  - Files: `frontend/src/lib/anim/gsap.ts`, `frontend/src/lib/anim/inview.ts`
  - Notes: Respect `prefers-reduced-motion`
- T005 Linting + A11y tooling for UI work
  - Files: `.eslintrc`, `frontend/src/setupTests.ts`
  - Notes: Ensure `axe-core` ready for tests

## Phase 3.2: Tests First (TDD)

- [x] T006 [P] A11y baseline tests for Light/Dark contrast and focus visibility
  - Files: `frontend/src/tests/a11y.theme.spec.ts`
  - Based on: FR-005, FR-017
- [x] T007 [P] Integration: theme toggle persists across reload and sessions
  - Files: `frontend/src/tests/theme.persistence.spec.ts`
  - Based on: FR-001, FR-002, FR-004
- [x] T008 [P] Integration: language switch updates UI and persists
  - Files: `frontend/src/tests/i18n.switch.persistence.spec.ts`
  - Based on: FR-006–FR-011
- [x] T009 [P] Integration: reduced motion disables/simplifies animations
  - Files: `frontend/src/tests/animations.reduced-motion.spec.ts`
  - Based on: FR-014–FR-015
- T010 [P] E2E mobile-first quickstart path
  - Files: `frontend/e2e/happy-path.spec.ts` (extend existing)
  - Based on: quickstart.md steps

## Phase 3.3: Core Implementation

- [x] T011 Implement theme tokens and variants (tweakcn)
  - Files: `frontend/src/lib/theme/tokens.ts`, `frontend/src/lib/theme/index.ts`
  - Deliver: `themeMode` handling (light/dark/system), CSS vars mapping
- [x] T012 Wire global ThemeProvider and control
  - Files: `frontend/src/main.tsx`, `frontend/src/components/ThemeToggle.tsx`
  - Deliver: accessible toggle present on every page
- [x] T013 Implement i18n setup for EN/EL with locale formats
  - Files: `frontend/src/lib/i18n/index.ts`, `frontend/src/lib/i18n/en.json`, `frontend/src/lib/i18n/el.json`
  - Deliver: router/layout integrates language switcher
- T014 Create LanguageSwitcher and apply translations across pages
  - Files: `frontend/src/components/LanguageSwitcher.tsx`, `frontend/src/pages/**`
  - Deliver: live updates without reload
- [x] T015 GSAP in-view animation utilities and hooks
  - Files: `frontend/src/lib/anim/gsap.ts`, `frontend/src/lib/anim/inview.ts`, `frontend/src/components/AnimatedList.tsx`
  - Deliver: scroll/enter viewport animations, non-blocking

## Phase 3.4: Integration

- [x] T016 Preference persistence per-user (when signed-in) and per-device (anonymous)
  - Files: `frontend/src/stores/preferences.ts`, `frontend/src/lib/persistence.ts`
  - Deliver: precedence: user > device > system > default
- [x] T017 Apply theme and i18n controls into app shell and all pages
  - Files: `frontend/src/pages/**`, `frontend/src/components/AppShell.tsx`
  - Deliver: consistent application across modals, toasts, errors
- T018 Respect reduced motion globally; add opt-out control (optional)
  - Files: `frontend/src/lib/anim/inview.ts`, `frontend/src/components/SettingsPanel.tsx`
  - Deliver: minimize/disable animations when requested

## Phase 3.5: Polish

- T019 [P] Performance pass: ensure 60 FPS target; simplify when >24ms/500ms
  - Files: `frontend/src/lib/anim/**`, component hotspots
- T020 [P] A11y audit: axe and manual checks across themes and languages
  - Files: `frontend/src/tests/**`
- T021 [P] Documentation: update README and quickstart with usage
  - Files: `frontend/README.md`, `specs/002-modern-fluid-ui/quickstart.md`

## Parallel Execution Examples

- Group 1 [P]: T006, T007, T008, T009, T010 (tests in different files)
- Group 2 [P]: T011, T013, T015 (different modules: theme, i18n, animations)
- Group 3 [P]: T019, T020, T021 (polish tasks)

## Dependency Notes

- Setup (T001–T005) → Tests (T006–T010) → Core (T011–T015) → Integration (T016–T018) → Polish (T019–T021)
- T012 depends on T011; T014 depends on T013; T015 depends on T004
- T016 depends on T012 and T014; T017 depends on T012–T015

```sh
# Example agent commands
# Run setup tasks
# (Executed by agent, not user)

# Run tests
pnpm -C frontend test
pnpm -C frontend test:e2e

# Lint
pnpm -C frontend lint
```
