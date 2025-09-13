# Tasks: Appointment Management Web Application

**Input**: Design documents from `c:/Users/jimzord12/Documents/GitHub/appointment-scheduler/specs/001-build-an-web/`
**Prerequisites**: `plan.md` (required), `research.md`, `data-model.md`, `contracts/`

Project structure: Web application (frontend + backend) per implementation plan (React 19 + Vite 7 frontend, Express 5 backend, shared types). Source code will adopt Option 2 structure described in `plan.md`.

Backend root: `backend/` Frontend root: `frontend/` Shared (future): `shared/` (if extracted later)

## Execution Flow (main)

```
1. Load plan.md from feature directory (DONE)
2. Load design documents: data-model.md, contracts/api-contracts.ts, research.md (DONE)
3. Generate tasks by category: setup, tests, core models/services/endpoints, frontend UI/state, integration, polish
4. Apply task rules: tests precede implementation, [P] for independent files, explicit dependencies
5. Number tasks sequentially T001..T0NN
6. Build dependency graph section
7. Parallel execution examples provided
8. Validate completeness: all contracts mapped to tests + impl, all entities have models, TDD ordering enforced
9. Output tasks.md (this file)
```

## Legend & Format

`[ID] [P?] Description (File Path)`
Includes: Acceptance Criteria (AC), Dependencies (Deps), Effort (S= <1h, M=1-2h, L= >2h), Spec Links.

---

## Phase 3.1: Repository & Environment Setup

- [ ] T001 Initialize monorepo structure (create `backend/`, `frontend/`, placeholder `shared/README.md`).
      AC: Directories exist; root `package.json` updated with workspaces if using PNPM/Yarn; no lint errors.
      Effort: S
      Links: plan.md (Project Structure)
- [ ] T002 Backend TypeScript setup: init `backend/package.json`, add deps (`express@5`, `zod`, `drizzle-orm`, `pg`, `better-auth`, `cors`, `helmet`, `express-rate-limit`, `dotenv`, `typescript`, `ts-node-dev`, `vitest`, `supertest`, `eslint`, `prettier`).
      AC: Can run `pnpm dev` to start placeholder server returning 200 `/health`.
      Deps: T001
      Effort: M
      Links: research.md (Backend stack)
- [ ] T003 Frontend Vite React TS setup: `frontend/` with React 19, TailwindCSS 4, shadcn components, TanStack Router, TanStack Query, Zustand, React Hook Form, date-fns, Vitest, RTL, MSW, ESLint, Prettier.
      AC: `pnpm dev` runs Vite app with placeholder landing page.
      Deps: T001
      Effort: M
      Links: research.md (Frontend stack)
- [ ] T004 [P] Configure root linting & formatting: `.eslintrc.*`, `.prettierrc`, `editorconfig`, add scripts and Husky + lint-staged hooks.
      AC: `pnpm lint` passes; pre-commit runs lint+typecheck.
      Deps: T001
      Effort: M
      Links: research.md (Best Practices)
- [ ] T005 Environment configuration: `.env.example` for backend (DATABASE_URL, JWT_SECRET, RATE_LIMIT, NODE_ENV), frontend (.env variables for API base). Add `dotenv` loading.
      AC: App boots with sample env; secrets excluded via `.gitignore`.
      Deps: T002, T003
      Effort: S
      Links: research.md (Security)

## Phase 3.2: Tests First (Backend Contracts & Models)

CRITICAL: All tests below MUST be authored and FAIL before any implementation tasks in later phases are executed.

Contract source: `specs/001-build-an-web/contracts/api-contracts.ts` endpoints (auth: register/login; user: getProfile/updateProfile; service: getServices/createService; appointment: getRequests/createRequest/updateRequest)

Paths (tests): `backend/tests/contract/`, `backend/tests/integration/`

- [ ] T006 Generate shared Zod schema export scaffolding in `backend/src/schemas/` (no implementation logic; export placeholders referencing spec).
      AC: Schemas imported compile; no route/server code yet.
      Deps: T002
      Effort: S
      Links: contracts/api-contracts.ts
- [ ] T007 [P] Contract test: POST /auth/register (file: `backend/tests/contract/auth.register.spec.ts`) asserts schema match + required fields validation errors.
      AC: Test fails (endpoint 404 or not implemented).
      Deps: T006
      Effort: S
      Links: contracts/api-contracts.ts (authProcedures.register)
- [ ] T008 [P] Contract test: POST /auth/login (`backend/tests/contract/auth.login.spec.ts`).
      AC: Failing test; covers invalid credentials path.
      Deps: T006
      Effort: S
      Links: contracts/api-contracts.ts (authProcedures.login)
- [ ] T009 [P] Contract test: GET /user/profile (`backend/tests/contract/user.profile.get.spec.ts`).
      AC: Fails; expects 401 when unauthenticated.
      Deps: T006
      Effort: S
      Links: userProcedures.getProfile
- [ ] T010 [P] Contract test: PATCH /user/profile (`backend/tests/contract/user.profile.patch.spec.ts`).
      AC: Fails; tests validation rules & partial update.
      Deps: T006
      Effort: S
      Links: userProcedures.updateProfile
- [ ] T011 [P] Contract test: GET /services (`backend/tests/contract/services.get.spec.ts`).
      AC: Fails; expects array schema.
      Deps: T006
      Effort: S
      Links: serviceProcedures.getServices
- [ ] T012 [P] Contract test: POST /services (`backend/tests/contract/services.post.spec.ts`).
      AC: Fails; validates field constraints.
      Deps: T006
      Effort: S
      Links: serviceProcedures.createService
- [ ] T013 [P] Contract test: GET /appointments/requests (`backend/tests/contract/appointments.requests.get.spec.ts`).
      AC: Fails; unauthorized when no auth.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.getRequests
- [ ] T014 [P] Contract test: POST /appointments/requests (`backend/tests/contract/appointments.requests.post.spec.ts`).
      AC: Fails; validates time format and date.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.createRequest
- [ ] T015 [P] Contract test: PATCH /appointments/requests/:id (`backend/tests/contract/appointments.requests.patch.spec.ts`).
      AC: Fails; ensures only status & managerNotes accepted.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.updateRequest
- [ ] T016 Integration test: User registration + login flow (`backend/tests/integration/auth.flow.spec.ts`) – register, duplicate handling, login invalid password, success path (expected fail).
      Deps: T007,T008
      Effort: M
      Links: authProcedures.\*
- [ ] T017 Integration test: Service CRUD minimal flow (`backend/tests/integration/services.flow.spec.ts`) – create (manager), list (customer), authorization difference (expected fail).
      Deps: T011,T012
      Effort: M
      Links: serviceProcedures.\*
- [ ] T018 Integration test: Appointment request lifecycle (`backend/tests/integration/appointments.flow.spec.ts`) – create request, approve, reject alt path, double-book prevention (expected fail).
      Deps: T013,T014,T015
      Effort: L
      Links: appointmentProcedures.\* data-model.md (business rules)

## Phase 3.3: Backend Core Implementation (Make Tests Pass)

(No task here starts until ALL Phase 3.2 tests exist & fail.)

- [ ] T019 Database config & Drizzle setup (`backend/src/db/index.ts`, migration folder).
      AC: Can run migration generation; connection uses env.
      Deps: T005,T006
      Effort: M
      Links: data-model.md
- [ ] T020 User schema + Drizzle model (`backend/src/db/schema/users.ts`).
      AC: Matches attributes & constraints; email unique index.
      Deps: T019
      Effort: S
      Links: data-model.md (User)
- [ ] T021 Service schema + model (`backend/src/db/schema/services.ts`).
      AC: durationMinutes range enforce; isActive default true.
      Deps: T019
      Effort: S
      Links: data-model.md (Service)
- [ ] T022 AppointmentRequest schema + model (`backend/src/db/schema/appointment_requests.ts`).
      AC: status enum default pending; indexes per spec.
      Deps: T019
      Effort: M
      Links: data-model.md (Appointment Request)
- [ ] T023 Appointment schema + model (`backend/src/db/schema/appointments.ts`).
      AC: FK unique on request_id; cascade delete policy documented.
      Deps: T022
      Effort: S
      Links: data-model.md (Appointment)
- [ ] T024 Auth service (register/login) (`backend/src/services/authService.ts`) using better-auth + bcrypt hashing strategy.
      AC: Passes T007,T008,T016 scenarios.
      Deps: T020
      Effort: M
      Links: contracts (auth), research.md (auth)
- [ ] T025 User profile service (`backend/src/services/userService.ts`) update fields with validation.
      AC: Passes T009,T010.
      Deps: T020,T024
      Effort: S
      Links: contracts (user)
- [ ] T026 Service management service (`backend/src/services/serviceService.ts`) create/list with role checks.
      AC: Passes T011,T012,T017.
      Deps: T021,T024
      Effort: M
      Links: contracts (service), data-model.md
- [ ] T027 Appointment workflow service (`backend/src/services/appointmentService.ts`) create request, list requests by user/role, update status with double-book prevention.
      AC: Passes T013–T015,T018.
      Deps: T022,T023,T024,T026
      Effort: L
      Links: contracts (appointment), data-model.md (business rules)
- [ ] T028 Express app setup (`backend/src/app.ts`) include JSON body parsing, cors, helmet, rate-limit, logging middleware stub.
      AC: Imports routes only (no logic duplication); health route green.
      Deps: T024–T027
      Effort: S
      Links: plan.md (performance/security)
- [ ] T029 Route layer + oRPC adapter (`backend/src/routes/*.ts`) mapping endpoints to services with Zod validation.
      AC: All contract tests pass (except integration-specific flows).
      Deps: T028
      Effort: M
      Links: contracts/api-contracts.ts
- [ ] T030 Error handling & response normalization (`backend/src/middleware/errorHandler.ts`).
      AC: Known validation/auth errors standardized; tests updated to assert shape.
      Deps: T029
      Effort: S
      Links: research.md (error handling)
- [ ] T031 Logging middleware structured JSON (`backend/src/middleware/logging.ts`).
      AC: Logs request id, timing, user id when present.
      Deps: T028
      Effort: S
      Links: plan.md (Observability)
- [ ] T032 Auth middleware / token verification (`backend/src/middleware/auth.ts`).
      AC: Protects authenticated routes, ties into better-auth issued tokens.
      Deps: T024
      Effort: M
      Links: contracts (auth)

## Phase 3.4: Frontend Tests First (Schemas & API Layer)

- [ ] T033 Frontend shared API client scaffolding (`frontend/src/lib/api/client.ts`) using oRPC client patterns (placeholder endpoints; tests failing).
      Deps: T003
      Effort: S
      Links: contracts/api-contracts.ts
- [ ] T034 [P] MSW handlers draft for auth/services/appointments endpoints (`frontend/tests/msw/handlers.ts`) mirroring contracts; return 501 initially.
      Deps: T033
      Effort: S
      Links: contracts
- [ ] T035 Integration test: auth flow UI (`frontend/tests/integration/auth.flow.spec.ts`) register → login → profile fetch (failing).
      Deps: T033,T034
      Effort: M
      Links: authProcedures.\*
- [ ] T036 Integration test: service list & create (manager) UI (`frontend/tests/integration/services.flow.spec.ts`).
      Deps: T033,T034
      Effort: M
      Links: serviceProcedures.\*
- [ ] T037 Integration test: appointment request lifecycle UI (`frontend/tests/integration/appointments.flow.spec.ts`).
      Deps: T033,T034
      Effort: L
      Links: appointmentProcedures.\*

## Phase 3.5: Frontend Core Implementation

- [ ] T038 State store: auth slice (`frontend/src/stores/auth.ts`) with user + token persistence.
      AC: Passes auth integration test steps for state.
      Deps: T035
      Effort: S
- [ ] T039 State store: services slice (`frontend/src/stores/services.ts`).
      AC: Passes service list/create flows.
      Deps: T036
      Effort: S
- [ ] T040 State store: appointments slice (`frontend/src/stores/appointments.ts`).
      AC: Supports request creation, status updates.
      Deps: T037
      Effort: M
- [ ] T041 Auth pages/components (`frontend/src/pages/auth/*` login/register forms with React Hook Form + Zod).
      AC: Validation errors surfaced; tests green.
      Deps: T038
      Effort: M
- [ ] T042 Services management UI (`frontend/src/pages/services/*` list + create form, role gating).
      AC: Passing integration test; manager-only create button.
      Deps: T039
      Effort: M
- [ ] T043 Appointment request UI (`frontend/src/pages/appointments/*` request form, list, manager approve/reject controls).
      AC: Lifecycle integration test passes.
      Deps: T040
      Effort: L
- [ ] T044 Routing setup with TanStack Router (`frontend/src/router/index.tsx`) and protected routes.
      AC: Unauthed redirect on protected routes.
      Deps: T038,T041–T043
      Effort: S
- [ ] T045 API hooks with TanStack Query (`frontend/src/lib/api/hooks/*.ts`) for each endpoint; optimistic updates where safe.
      AC: Cache updates visible; no stale profile after update.
      Deps: T038–T043
      Effort: M
- [ ] T046 UI polish & shadcn components integration (buttons, forms, modals) (`frontend/src/components/ui/*`).
      AC: Accessibility: passes basic axe check in tests.
      Deps: T041–T045
      Effort: M

## Phase 3.6: Cross-Cutting Integration & Hardening

- [ ] T047 Security hardening verification: rate limits, CORS, helmet config test (`backend/tests/integration/security.spec.ts`).
      Deps: T028,T030,T032
      Effort: S
- [ ] T048 Double-booking enforcement test (`backend/tests/integration/appointments.doublebooking.spec.ts`) ensures second overlapping approval fails.
      Deps: T027,T018
      Effort: S
- [ ] T049 Performance test backend (<2s worst case endpoints, typical <500ms) (`backend/tests/perf/perf.spec.ts`).
      Deps: T029,T030
      Effort: M
- [ ] T050 Frontend perf & bundle size check script (`frontend/scripts/analyze-bundle.ts`).
      Deps: T045
      Effort: S
- [ ] T051 Logging validation test ensures structured fields present (`backend/tests/integration/logging.spec.ts`).
      Deps: T031
      Effort: S
- [ ] T052 Accessibility test suite (`frontend/tests/a11y/a11y.spec.ts`) covering primary pages.
      Deps: T046
      Effort: S

## Phase 3.7: Polish & Documentation

- [ ] T053 Unit tests for utility/date validation (`backend/tests/unit/validation.spec.ts`).
      Deps: T029
      Effort: S
- [ ] T054 Unit tests for frontend form validation (`frontend/tests/unit/forms.validation.spec.ts`).
      Deps: T041
      Effort: S
- [ ] T055 Update quickstart with run/test instructions (`specs/001-build-an-web/quickstart.md`).
      Deps: T002,T003,T029,T045
      Effort: S
- [ ] T056 Developer docs: API endpoints documented (`backend/README.md` section or `docs/api.md`).
      Deps: T029
      Effort: S
- [ ] T057 Clean duplication & refactor passes (remove dead code, ensure file boundaries) (no direct file path).
      Deps: All core backend (T019–T032) + frontend core (T038–T046)
      Effort: M
- [ ] T058 Final CI pipeline config (GitHub Actions) for lint, typecheck, test matrix Node 22 / OS.
      Deps: T004,T006–T018 (tests must exist)
      Effort: M
- [ ] T059 Release prep: version bump, changelog draft, tag instructions.
      Deps: T057,T058
      Effort: S

## Dependencies Summary (Graph Excerpts)

- T006 → T007–T015 → (Integration tests T016–T018) → Backend impl T019+
- Models chain: T019 → T020 → (T024,T025) ; T019 → T021 → T026 ; T019 → T022 → T023 → T027
- Services depend on respective models + auth
- Frontend tests (T033–T037) precede frontend state/UI (T038–T046)
- Hardening tasks (T047–T052) after core backend/frontend
- Documentation & polish after primary features stable

## Parallel Execution Examples

```
# Example 1: Early contract tests (all [P])
T007 T008 T009 T010 T011 T012 T013 T014 T015

# Example 2: After DB setup
T020 T021 T022 (while migrations generated) then T023

# Example 3: Frontend integration tests
T035 T036 T037 run after T033,T034
```

## Validation Checklist Mapping

- All contracts → tests T007–T015 (YES)
- All entities → models T020–T023 (YES)
- Tests precede implementation (Phases 3.2 before 3.3) (YES)
- Parallel tasks only independent distinct files (YES - validated by file paths)
- Every implementation task references tests covering it (YES via Deps & Links)

## Effort Totals (Rough)

S: 32 M: 19 L: 4 (Total tasks: 59)

## Notes

- Keep commits atomic: one task = one commit where feasible.
- Ensure failing tests are committed BEFORE implementation commits they drive.
- Re-run lint & typecheck on each commit.
- Consider extracting shared Zod types to `shared/` only after backend stable (avoid premature optimization).

---

Generated September 12, 2025 from branch `001-build-an-web`.

