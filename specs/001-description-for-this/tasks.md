# Tasks: Complete UI polish for appointment scheduling app

**Feature Directory**: C:\\Github\\appointment-scheduler\\specs\\001-description-for-this
**Input**: Design documents from `C:\GitHub\appointment-scheduler\specs\001-description-for-this`
**Prerequisites**:

- `C:\GitHub\appointment-scheduler\specs\001-description-for-this\plan.md`
- `C:\GitHub\appointment-scheduler\specs\001-description-for-this\research.md`
- `C:\GitHub\appointment-scheduler\specs\001-description-for-this\data-model.md`
- `C:\GitHub\appointment-scheduler\specs\001-description-for-this\contracts\mock-scheduling-api.yaml`
- `C:\GitHub\appointment-scheduler\specs\001-description-for-this\quickstart.md`

## Task List

- [x] T001 Draft the shared UI PRD in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\ui-prd.md`, capturing each page’s goal, primary action, KPIs, personas, and constitutional guardrails (export Notion source to Markdown).
- [x] T002 Set up the stakeholder feedback log in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\ui-feedback-log.md`, templating review cadence, attendees, decisions, and follow-up tracking.
- [x] T003 Author the mock-to-live transition playbook in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\mock-to-live-playbook.md`, covering MSW disablement, backend readiness checks, contract validation, and rollback triggers.
- [x] T004 [P] Add a UI performance benchmark harness at `C:\GitHub\appointment-scheduler\frontend\tests\performance\ui-polish.perf.ts` (e.g., Playwright trace or Vitest + jsdom timers), asserting navigation latency ≤500 ms and theme toggle feedback ≤100 ms, and expose the run command in `C:\GitHub\appointment-scheduler\frontend\package.json`.
- [x] T005 Initialize Shadcn UI tooling by running `pnpm dlx shadcn@latest init` and `pnpm dlx shadcn@latest mcp init --client vscode`, wiring scripts in `C:\GitHub\appointment-scheduler\frontend\package.json`, and committing generated components under `C:\GitHub\appointment-scheduler\frontend\src\components\ui\`.
- [ ] T006 Merge Darkmatter theme tokens into `C:\GitHub\appointment-scheduler\frontend\src\index.css`, `C:\GitHub\appointment-scheduler\frontend\src\lib\theme\tokens.ts`, and `C:\GitHub\appointment-scheduler\frontend\src\lib\theme\index.ts`, ensuring CSS custom properties drive Tailwind v4 styling.
- [ ] T007 Scaffold deterministic Faker/MSW generation by adding an `msw:generate` script in `C:\GitHub\appointment-scheduler\frontend\package.json`, creating `C:\GitHub\appointment-scheduler\frontend\src\mocks\data.ts`, and hooking it into `C:\GitHub\appointment-scheduler\frontend\src\mocks\server.ts`.
- [ ] T008 [P] Replace the stub in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\contracts\tests\appointments.contract.test.ts` with failing Vitest coverage for `/appointments` list/create/status plus `/notifications/manager` payloads against the OpenAPI schemas.
- [ ] T009 [P] Replace the stub in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\contracts\tests\services.contract.test.ts` with failing Vitest assertions validating `/services` responses and category grouping rules.
- [ ] T010 [P] Replace the stub in `C:\GitHub\appointment-scheduler\specs\001-description-for-this\contracts\tests\user-profile.contract.test.ts` with failing Vitest assertions for `/user/profile` GET/PATCH schemas including locale and notification preferences.
- [ ] T011 [P] Add React Testing Library integration at `C:\GitHub\appointment-scheduler\frontend\tests\integration\calendar-first.flow.test.tsx` covering calendar-first rendering, countdown gating, and reduced-motion handling.
- [ ] T012 [P] Add manager approval lifecycle integration test at `C:\GitHub\appointment-scheduler\frontend\tests\integration\manager-approval.flow.test.tsx` that exercises pending→approved/rejected UI updates and notification hooks.
- [ ] T013 [P] Add countdown timer unit test at `C:\GitHub\appointment-scheduler\frontend\tests\unit\countdown-timer.test.tsx` verifying state transitions and zeroing logic.
- [ ] T014 [P] Add Playwright e2e spec at `C:\GitHub\appointment-scheduler\frontend\e2e\ui-polish.spec.ts` to navigate all ten pages, toggle Darkmatter theme, validate offline MSW fallback messaging, and record timing metrics for performance goals.
- [ ] T015 [P] Add accessibility regression test at `C:\GitHub\appointment-scheduler\frontend\tests\accessibility\calendar.a11y.test.tsx` using axe-core to enforce WCAG 2.2 AA on calendar interactions.
- [ ] T016 [P] Create `C:\GitHub\appointment-scheduler\frontend\src\types\appointment.ts` exporting Zod schemas/types for Appointment with countdownSeconds, status transitions, and notes constraints.
- [ ] T017 [P] Create `C:\GitHub\appointment-scheduler\frontend\src\types\manager-decision.ts` exporting ManagerDecision schema and audit metadata per data-model.md.
- [ ] T018 [P] Create `C:\GitHub\appointment-scheduler\frontend\src\types\service.ts` exporting Service schema covering category enum, price/duration validation, and active flag.
- [ ] T019 [P] Create `C:\GitHub\appointment-scheduler\frontend\src\types\user-profile.ts` exporting UserProfile schema with locale, notification preferences, hasActiveAppointment, and motion preference flags.
- [ ] T020 [P] Create `C:\GitHub\appointment-scheduler\frontend\src\types\page-interaction.ts` capturing PageInteraction definitions (primary actions, personas, telemetry events) from the UI PRD.
- [ ] T021 [P] Add `C:\GitHub\appointment-scheduler\frontend\src\types\index.ts` to re-export new schemas for downstream consumers (stores, components, API client).
- [ ] T022 Update `C:\GitHub\appointment-scheduler\shared\contracts\api-contracts.ts` to align with mock-scheduling API (appointments countdown, manager decisions, user locale, notification payloads, services grouping).
- [ ] T023 Update `C:\GitHub\appointment-scheduler\frontend\src\lib\api\client.ts` to call `/appointments`, `/appointments/{id}`, `/appointments/{id}/status`, `/services`, `/user/profile`, and `/notifications/manager` using the refreshed shared contracts.
- [ ] T024 [P] Implement Darkmatter-styled countdown timer component at `C:\GitHub\appointment-scheduler\frontend\src\components\ui\CountdownTimer.tsx` consuming the new Appointment types and respecting reduced motion.
- [ ] T025 [P] Implement appointment summary card component at `C:\GitHub\appointment-scheduler\frontend\src\components\ui\AppointmentCard.tsx` that merges service metadata, countdown, and manager decision badges.
- [ ] T026 [P] Implement manager decision badge component at `C:\GitHub\appointment-scheduler\frontend\src\components\ui\ManagerDecisionBadge.tsx` encoding approval state color tokens.
- [ ] T027 [P] Implement page heading + persona chip component at `C:\GitHub\appointment-scheduler\frontend\src\components\ui\PageHeading.tsx` driven by PageInteraction definitions for telemetry tagging.
- [ ] T028 Populate deterministic Faker dataset in `C:\GitHub\appointment-scheduler\frontend\src\mocks\data.ts` (seed 20250925) enforcing one-active-appointment rule and manager decision history.
- [ ] T029 Implement MSW GET `/appointments` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\appointments.ts` returning persona-specific lists with countdownSeconds.
- [ ] T030 Implement MSW POST `/appointments` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\appointments.ts` enforcing duplicate booking guard and seeding pending status.
- [ ] T031 Implement MSW GET `/appointments/{id}` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\appointments.ts` with 404 coverage and manager decision hydration.
- [ ] T032 Implement MSW PATCH `/appointments/{id}/status` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\appointments.ts` applying state machine validation and triggering notification enqueue.
- [ ] T033 [P] Implement MSW GET `/services` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\services.ts` grouping results by category with pricing normalization.
- [ ] T034 Implement MSW `/user/profile` GET + PATCH handlers in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\user.ts` syncing locale, notification preferences, and hasActiveAppointment toggles.
- [ ] T035 [P] Implement MSW POST `/notifications/manager` handler in `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers\notifications.ts` logging mock telemetry payloads.
- [ ] T036 Update `C:\GitHub\appointment-scheduler\frontend\src\mocks\handlers.ts` to assemble the new domain handler modules and remove legacy `/appointments/requests` wiring.
- [ ] T037 Update `C:\GitHub\appointment-scheduler\frontend\src\mocks\server.ts` and `C:\GitHub\appointment-scheduler\frontend\src\setupTests.ts` to register refreshed handlers for dev, test, and e2e contexts.
- [ ] T038 Refactor `C:\GitHub\appointment-scheduler\frontend\src\stores\appointments.ts` to consume new API client methods, handle countdownSeconds, and emit telemetry events.
- [ ] T039 [P] Refactor `C:\GitHub\appointment-scheduler\frontend\src\stores\services.ts` to map Service schemas, cache categorised results, and expose loading/error states.
- [ ] T040 [P] Refactor `C:\GitHub\appointment-scheduler\frontend\src\stores\auth.ts` to persist role, hasActiveAppointment, and preferredLocale derived from the updated profile.
- [ ] T041 [P] Refactor `C:\GitHub\appointment-scheduler\frontend\src\stores\preferences.ts` to hydrate theme/motion/language from user profile defaults and Darkmatter tokens.
- [ ] T042 [P] Update layout shell in `C:\GitHub\appointment-scheduler\frontend\src\components\layout\AppLayout.tsx` to surface page breadcrumbs, persona context, and theme toggle placements.
- [ ] T043 [P] Update `C:\GitHub\appointment-scheduler\frontend\src\components\ThemeToggle.tsx` to leverage Darkmatter token utilities and respect reduced-motion preference.
- [ ] T044 [P] Update `C:\GitHub\appointment-scheduler\frontend\src\components\LanguageSwitcher.tsx` to integrate locale list from PageInteraction metadata and emit telemetry.
- [ ] T045 [P] Update `C:\GitHub\appointment-scheduler\frontend\src\router\index.tsx` to register all ten routes with TanStack Router, lazy load pages, and attach PageInteraction data.
- [ ] T046 Expand translations in `C:\GitHub\appointment-scheduler\frontend\src\lib\i18n\en.json` and `C:\GitHub\appointment-scheduler\frontend\src\lib\i18n\el.json` for new PRD-driven copy, accessibility hints, and manager notifications.
- [ ] T047 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Home.tsx` with updated hero, persona CTAs, and telemetry per PageInteraction.
- [ ] T048 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Dashboard.tsx` to surface active appointment countdown, notifications, and theme-responsive KPIs.
- [ ] T049 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Appointments.tsx` to render grouped appointment lists with manager decision badges and calendar-first layout.
- [ ] T050 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\ManagerAppointments.tsx` to support approval queues, filters, and notification triggers.
- [ ] T051 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\BookAppointment.tsx` with Shadcn form controls, validation against available slots, and countdown-prevented CTA state.
- [ ] T052 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Services.tsx` to showcase category tabs, pricing, and motion-safe animations.
- [ ] T053 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\ServiceDetails.tsx` to display availability, related services, and telemetry events.
- [ ] T054 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Profile.tsx` to edit locales, notification toggles, and motion preference with optimistic updates.
- [ ] T055 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Login.tsx` to align with Darkmatter typography and show localized auth copy.
- [ ] T056 [P] Polish `C:\GitHub\appointment-scheduler\frontend\src\pages\Register.tsx` to cover role selection, password hints, and telemetry for sign-up funnel.
- [ ] T057 [P] Add analytics events module at `C:\GitHub\appointment-scheduler\frontend\src\lib\analytics\events.ts` providing typed emitters that align with PageInteraction telemetry and feed the stakeholder feedback log.
- [ ] T058 [P] Install and configure Storybook for the frontend (e.g., `pnpm dlx storybook@latest init --builder @storybook/builder-vite`), then add Darkmatter-themed stories and visual regression baselines for countdown, appointment card, and manager components under `C:\GitHub\appointment-scheduler\frontend\src\components\ui\__stories__`.
- [ ] T059 [P] Update `C:\GitHub\appointment-scheduler\specs\001-description-for-this\quickstart.md` with final command matrix (including Shadcn init, MCP init, Darkmatter import), Storybook/axe steps, and telemetry validation notes.
- [ ] T060 [P] Document feature summary and constitutional coverage in `C:\GitHub\appointment-scheduler\CHANGELOG.md` and, if needed, `C:\GitHub\appointment-scheduler\frontend\README.md`.
- [ ] T061 Run full test matrix (`pnpm -C backend run test:db`, `pnpm -C frontend test`, `pnpm -C frontend test:e2e`, `pnpm -C frontend run storybook --ci`, `pnpm -C frontend test:performance`) and attach output under `C:\GitHub\appointment-scheduler\test-results\`.

## Dependencies

- T008–T015 depend on completing setup tasks T001–T007.
- T016–T021 depend on contract tests (T008–T010) being in place; T022 consumes the new type definitions.
- T023 relies on T022 so the API client uses the refreshed shared contracts.
- T024–T027 require models (T016–T021) and theme setup (T001–T006).
- T028 must follow T007 and precede MSW handlers T029–T035.
- T029–T032 execute sequentially because they modify `appointments.ts`.
- T033–T037 depend on dataset (T028) and shared contracts (T022).
- Stores (T038–T041) rely on API client (T023) and handlers (T029–T035).
- Shell updates (T042–T045) depend on stores (T038–T041) and UI components (T024–T027).
- Translation expansion T046 must complete before page polish tasks T047–T056 to avoid missing locale keys.
- Pages (T047–T056) depend on shell, stores, handlers, and tests already staged.
- Analytics module T057 should precede page instrumentation tasks (T047–T056) and store telemetry hooks (T038).
- Storybook/docs tasks T058–T060 depend on UI components and pages being updated.
- Final validation T061 runs after all implementation and documentation tasks.

## Parallel Execution Examples

```
# After completing T007, launch contract and integration test scaffolding in parallel:
task-agent run --id T008
task-agent run --id T009
task-agent run --id T010

# With models ready (T016–T021) you can implement independent UI primitives together:
task-agent run --id T024
task-agent run --id T025
task-agent run --id T026
task-agent run --id T027

# Once MSW handlers are stable (T028–T037), polish pages concurrently:
task-agent run --id T047
task-agent run --id T048
task-agent run --id T049
task-agent run --id T052
```

## Notes

- Mark tasks [P] only when they touch disjoint files; remove [P] if implementation reveals shared resources.
- Keep TDD discipline: ensure every new test fails before the corresponding implementation task.
- Record telemetry event naming in `C:\GitHub\appointment-scheduler\frontend\src\lib\analytics\events.ts` so QA can trace emissions during T057.
