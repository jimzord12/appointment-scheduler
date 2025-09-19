# Tasks: 001-build-an-web — Appointment Management Web App

Input: `c:\Github\appointment-scheduler\specs\001-build-an-web\plan.md`
Related specs:

- Spec: `c:\Github\appointment-scheduler\specs\001-build-an-web\spec.md`
- Research: `c:\Github\appointment-scheduler\specs\001-build-an-web\research.md`
- Data model: `c:\Github\appointment-scheduler\specs\001-build-an-web\data-model.md`
- Contracts: `c:\Github\appointment-scheduler\specs\001-build-an-web\contracts\api-contracts.ts`

Execution notes

- Scope: Remaining implementation and hardening for the feature branch `001-build-an-web`.
- Method: TDD — author/adjust tests first (RED) then implement (GREEN) and refactor.
- Path style: All paths are absolute (Windows) and target the current repository structure.

Format: [ID] [P?] Title

- [P] means can run in parallel (distinct files/areas, no dependency).
- Each task lists Description, Acceptance Criteria (AC), Dependencies (Deps), Estimate (Est), and Links.

Legend for Estimates

- XS ≈ 0.5h, S ≈ 1–2h, M ≈ 3–5h, L ≈ 1–2 days

---

## Backend Tasks

T076 Remove duplicate Drizzle schema for appointment requests

- Description: Remove `c:\Github\appointment-scheduler\backend\src\db\schema\appointmentRequests.ts` in favor of `c:\Github\appointment-scheduler\backend\src\db\schema\appointment_requests.ts` and align field types with transport (string dates, HH:mm times) where appropriate; regenerate migrations if needed.
- AC:
  - Only one schema file remains for appointment requests.
  - Drizzle compiles with no schema conflicts.
  - Tests referencing the model pass type-check.
- Deps: None
- Est: S
- Links: data-model, contracts

T077 Wire Drizzle DB for AppointmentRequest and Appointment services (replace in-memory)

- Description: Refactor `c:\Github\appointment-scheduler\backend\src\services\appointmentService.ts` to use Drizzle queries against `appointment_requests` and `appointments` tables, preserving business rules (pending→approved/rejected, no double-booking).
- AC:
  - Contract tests under `c:\Github\appointment-scheduler\backend\tests\contract\appointments.*` pass using DB-backed logic.
  - Integration tests `appointments.flow.spec.ts` and `appointments.doublebooking.spec.ts` pass and enforce 409 on conflict.
- Deps: T076
- Est: M
- Links: data-model, contracts

T078 Add rate limiting middleware with environment controls

- Description: Add `express-rate-limit` in `c:\Github\appointment-scheduler\backend\src\app.ts` with sane defaults; make thresholds configurable via env.
- AC:
  - Default dev limits permissive; production limits configurable.
  - Requests beyond limit return 429 with `{ error: 'rate_limit' }`.
  - Add unit/integration test for rate limit behavior (can be feature-flagged in test).
- Deps: None
- Est: S
- Links: research.md, app.ts

T079 Enforce JWT secret in production and improve config safety

- Description: In `c:\Github\appointment-scheduler\backend\src\services\authService.ts` and config bootstrap, require `JWT_SECRET` in production; keep safe fallback only in dev/test.
- AC:
  - App start fails fast with clear error if `NODE_ENV=production` and `JWT_SECRET` missing.
  - All tests pass in dev/test without additional setup.
- Deps: None
- Est: S
- Links: research.md

T080 Restrict CORS in production

- Description: Configure CORS in `c:\Github\appointment-scheduler\backend\src\app.ts` to allow all in dev/test and restrict to `ALLOWED_ORIGINS` in prod.
- AC:
  - Dev/test behavior unchanged.
  - Prod blocks unauthorized origins; returns proper CORS headers for allowed ones.
- Deps: None
- Est: S
- Links: research.md, app.ts

T081 Add request ID correlation to logging

- Description: Enhance `c:\Github\appointment-scheduler\backend\src\middleware\logging.ts` to attach a per-request ID (from `x-request-id` or generated) and propagate to logs and error handler.
- AC:
  - All logs for a request include `requestId`.
  - Unit test updated/added under `backend/tests/unit/logging.middleware.spec.ts`.
- Deps: None
- Est: S
- Links: research.md

T082 Generate OpenAPI spec from Zod contracts

- Description: Use `zod-openapi` to generate `openapi.json` from `c:\Github\appointment-scheduler\specs\001-build-an-web\contracts\api-contracts.ts`; publish artifact under `c:\Github\appointment-scheduler\backend\dist\openapi.json` and document generation script in root `package.json` or backend `package.json`.
- AC:
  - Script `pnpm openapi:generate` produces a valid OpenAPI file.
  - Basic smoke validation passes (e.g., swagger-parser or openapi-schema-validator).
- Deps: Contracts stable
- Est: M
- Links: contracts

T083 Migrate User/Service services to DB (phase 1)

- Description: Refactor `authService.ts`, `userService.ts`, and `serviceService.ts` to use Drizzle for persistence (users, services) with existing validation and role enforcement.
- AC:
  - Contract tests for auth, user profile, and services pass using DB-backed persistence.
  - Seeding utility for creating a manager user for tests updated if necessary.
- Deps: T076
- Est: M
- Links: data-model, contracts

T084 Lazy DB initialization for non-DB test scenarios

- Description: Guard DB connection so that suites not exercising DB don’t fail at import-time.
- AC:
  - All current tests run without requiring a live DB unless needed.
  - Clear error surfaces if a DB call is made without initialization.
- Deps: None
- Est: S
- Links: backend/src/db/index.ts

## Frontend Tasks

T085 Implement authentication pages with React Hook Form + Zod

- Description: Create Login and Register pages, wire to `frontend/src/lib/api/client.ts` with contract-backed parsing; manage auth state in a Zustand store.
- AC:
  - Happy path login/register flows succeed; invalid inputs show errors client-side and server-side.
  - Tests under `frontend/src/tests/integration/auth-flow.spec.tsx` pass.
- Deps: None
- Est: M
- Links: spec.md, contracts

T086 Services list and create (manager-only UI)

- Description: Implement Services page showing list from API and a create form gated by role; use shadcn components.
- AC:
  - Managers can create a service; customers see read-only list.
  - Tests cover role gating and error states.
- Deps: T085 (auth state)
- Est: M
- Links: spec.md, contracts

T087 Appointment request form and list

- Description: Build page to create appointment requests (service select, date, time, notes) and view own requests; validation via Zod.
- AC:
  - Creating a request shows in list; server validation errors surface.
  - Tests cover form validation and success path.
- Deps: T085, T086
- Est: M
- Links: spec.md, contracts

T088 Manager approval workflow UI

- Description: Manager can view pending requests and approve/reject; handle conflict errors (409) with user-friendly messaging.
- AC:
  - Approve/reject updates list status; conflict shows proper banner.
  - Tests simulate 409 and verify UI response.
- Deps: T087; Backend T077
- Est: M
- Links: spec.md

T089 Routing with TanStack Router and protected routes

- Description: Configure routes, nested layouts, and auth-protected segments; redirect unauthenticated users to login.
- AC:
  - Deep links work; protected routes enforce auth.
  - Router tests cover basic navigation/guards.
- Deps: T085
- Est: S
- Links: frontend/src/router

T090 Loading/Error UX and a11y pass

- Description: Ensure skeletons/spinners for API calls, accessible labels, and keyboard navigation; fix remaining act() warnings.
- AC:
  - No axe-core violations in key pages.
  - Tests adjusted to remove act() warnings where feasible.
- Deps: T085–T089
- Est: M
- Links: research.md

## Integration, Testing, and DevOps

T091 Update and stabilize contract tests for final transport types

- Description: Ensure contract tests parse string date/time per contracts; remove any lingering `z.date()` expectations.
- AC:
  - All contract tests in `c:\Github\appointment-scheduler\backend\tests\contract\` pass against current contracts.
- Deps: Contracts stable; Backend T077/T083 as needed
- Est: S
- Links: contracts

T092 End-to-end happy path across FE/BE with MSW off

- Description: Add a smoke E2E test that runs real backend (test mode) and frontend against it (no MSW), covering login → create service → request → approve.
- AC:
  - Scripted E2E test passes locally in CI-like environment.
- Deps: T077, T083, T085–T088
- Est: L
- Links: quickstart.md

T093 Quickstart and backend API README updates

- Description: Update `c:\Github\appointment-scheduler\specs\001-build-an-web\quickstart.md` and add/update backend API README with endpoints, auth, env, and OpenAPI generate instructions.
- AC:
  - Docs reflect current commands and env variables.
- Deps: T082
- Est: S
- Links: quickstart.md

T094 CI pipeline: lint, typecheck, test, OpenAPI artifact

- Description: Add/adjust CI to run lint, typecheck, tests for backend/frontend, and publish `openapi.json` as artifact.
- AC:
  - CI green on main and PRs; OpenAPI artifact uploaded.
- Deps: T082
- Est: M
- Links: repo root CI config (to be added if missing)

T095 Seed and local dev database automation

- Description: Provide `pnpm db:dev:up` and `pnpm db:seed` scripts; optionally Docker Compose for Postgres; ensure the backend can boot locally with minimal steps.
- AC:
  - Developer can bring up DB and seed with a single command sequence.
- Deps: T077, T083
- Est: M
- Links: backend/drizzle/config.ts, db/index.ts

---

Dependencies summary

- Backend: T076 → T077 → (T083), and T082 after contracts finalize; T078–T081, T084 independent.
- Frontend: T085 → T086 → T087 → T088; T089 depends on T085; T090 after others.
- Integration: T091 after contract stabilization; T092 after BE/FE core; T093 after T082; T094 after T082; T095 after DB-backed services.

Traceability

- Derived from: spec.md user stories (auth, services, appointment request/approval), data-model entities, and API contracts. Each task maps to concrete endpoints or UI stories to ensure end-to-end coverage.

Parallelization examples

- In parallel: T078, T079, T080, T081, T084 (distinct files/concerns).
- In parallel: T085 and T089 once auth store shape is decided.

---

Readiness

- Completing T076–T083 and T091 will make backend feature-complete and contract-aligned.
- Completing T085–T088 will make the primary UI flows usable.
- T092–T095 harden the system for CI and team onboarding.

# Tasks: Appointment Management Web Application

## Completion Summary

- **40 tasks (67.8%) are completed** ✅
- **0 tasks (0%) are partially completed** ⚠️
- **19 tasks (32.2%) are not completed** ❌

**Input**: Design documents from `c:/Github/appointment-scheduler/specs/001-build-an-web/`
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

- [x] T001 Initialize monorepo structure (create `backend/`, `frontend/`, placeholder `shared/README.md`).
      AC: Directories exist; root `package.json` updated with workspaces if using PNPM/Yarn; no lint errors.
      Effort: S
      Links: plan.md (Project Structure)
- [x] T002 Backend TypeScript setup: init `backend/package.json`, add deps (`express@5`, `zod`, `drizzle-orm`, `pg`, `better-auth`, `cors`, `helmet`, `express-rate-limit`, `dotenv`, `typescript`, `ts-node-dev`, `vitest`, `supertest`, `eslint`, `prettier`).
      AC: Can run `pnpm dev` to start placeholder server returning 200 `/health`.
      Deps: T001
      Effort: M
      Links: research.md (Backend stack)
- [x] T003 Frontend Vite React TS setup: `frontend/` with React 19, TailwindCSS 4, shadcn components, TanStack Router, TanStack Query, Zustand, React Hook Form, date-fns, Vitest, RTL, MSW, ESLint, Prettier.
      AC: `pnpm dev` runs Vite app with placeholder landing page.
      Deps: T001
      Effort: M
      Links: research.md (Frontend stack)
- [x] T004 [P] Configure root linting & formatting: `.eslintrc.*`, `.prettierrc`, `editorconfig`, add scripts and Husky + lint-staged hooks.
      AC: `pnpm lint` passes; pre-commit runs lint+typecheck.
      Deps: T001
      Effort: M
      Links: research.md (Best Practices)
- [x] T005 Environment configuration: `.env.example` for backend (DATABASE_URL, JWT_SECRET, RATE_LIMIT, NODE_ENV), frontend (.env variables for API base). Add `dotenv` loading.
      AC: App boots with sample env; secrets excluded via `.gitignore`.
      Deps: T002, T003
      Effort: S
      Links: research.md (Security)

## Phase 3.2: Tests First (Backend Contracts & Models)

CRITICAL: All tests below MUST be authored and FAIL before any implementation tasks in later phases are executed.

Contract source: `specs/001-build-an-web/contracts/api-contracts.ts` endpoints (auth: register/login; user: getProfile/updateProfile; service: getServices/createService; appointment: getRequests/createRequest/updateRequest)

Paths (tests): `backend/tests/contract/`, `backend/tests/integration/`

- [x] T006 Generate shared Zod schema export scaffolding in `backend/src/schemas/` (no implementation logic; export placeholders referencing spec).
      AC: Schemas imported compile; no route/server code yet.
      Deps: T002
      Effort: S
      Links: contracts/api-contracts.ts
- [x] T007 [P] Contract test: POST /auth/register (file: `backend/tests/contract/auth.register.spec.ts`) asserts schema match + required fields validation errors.
      AC: Test fails (endpoint 404 or not implemented).
      Deps: T006
      Effort: S
      Links: contracts/api-contracts.ts (authProcedures.register)
- [x] T008 [P] Contract test: POST /auth/login (`backend/tests/contract/auth.login.spec.ts`).
      AC: Failing test; covers invalid credentials path.
      Deps: T006
      Effort: S
      Links: contracts/api-contracts.ts (authProcedures.login)
- [x] T009 [P] Contract test: GET /user/profile (`backend/tests/contract/user.profile.get.spec.ts`).
      AC: Fails; expects 401 when unauthenticated.
      Deps: T006
      Effort: S
      Links: userProcedures.getProfile
- [x] T010 [P] Contract test: PATCH /user/profile (`backend/tests/contract/user.profile.patch.spec.ts`).
      AC: Fails; tests validation rules & partial update.
      Deps: T006
      Effort: S
      Links: userProcedures.updateProfile
- [x] T011 [P] Contract test: GET /services (`backend/tests/contract/services.get.spec.ts`).
      AC: Fails; expects array schema.
      Deps: T006
      Effort: S
      Links: serviceProcedures.getServices
- [x] T012 [P] Contract test: POST /services (`backend/tests/contract/services.post.spec.ts`).
      AC: Fails; validates field constraints.
      Deps: T006
      Effort: S
      Links: serviceProcedures.createService
- [x] T013 [P] Contract test: GET /appointments/requests (`backend/tests/contract/appointments.requests.get.spec.ts`).
      AC: Fails; unauthorized when no auth.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.getRequests
- [x] T014 [P] Contract test: POST /appointments/requests (`backend/tests/contract/appointments.requests.post.spec.ts`).
      AC: Fails; validates time format and date.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.createRequest
- [x] T015 [P] Contract test: PATCH /appointments/requests/:id (`backend/tests/contract/appointments.requests.patch.spec.ts`).
      AC: Fails; ensures only status & managerNotes accepted.
      Deps: T006
      Effort: S
      Links: appointmentProcedures.updateRequest
- [x] T016 Integration test: User registration + login flow (`backend/tests/integration/auth.flow.spec.ts`) – register, duplicate handling, login invalid password, success path (expected fail).
      Deps: T007,T008
      Effort: M
      Links: authProcedures.\*
- [x] T017 Integration test: Service CRUD minimal flow (`backend/tests/integration/services.flow.spec.ts`) – create (manager), list (customer), authorization difference (expected fail).
      Deps: T011,T012
      Effort: M
      Links: serviceProcedures.\*
- [x] T018 Integration test: Appointment request lifecycle (`backend/tests/integration/appointments.flow.spec.ts`) – create request, approve, reject alt path, double-book prevention (expected fail).
      Deps: T013,T014,T015
      Effort: L
      Links: appointmentProcedures.\* data-model.md (business rules)

## Phase 3.3: Backend Core Implementation (Make Tests Pass)

(No task here starts until ALL Phase 3.2 tests exist & fail.)

- [x] T019 Database config & Drizzle setup (`backend/src/db/index.ts`, migration folder).
      AC: Can run migration generation; connection uses env.
      Deps: T005,T006
      Effort: M
      Links: data-model.md
- [x] T020 User schema + Drizzle model (`backend/src/db/schema/users.ts`).
      AC: Matches attributes & constraints; email unique index.
      Deps: T019
      Effort: S
      Links: data-model.md (User)
- [x] T021 Service schema + model (`backend/src/db/schema/services.ts`).
      AC: durationMinutes range enforce; isActive default true.
      Deps: T019
      Effort: S
      Links: data-model.md (Service)
- [x] T022 AppointmentRequest schema + model (`backend/src/db/schema/appointment_requests.ts`).
      AC: status enum default pending; indexes per spec.
      Deps: T019
      Effort: M
      Links: data-model.md (Appointment Request)
- [x] T023 Appointment schema + model (`backend/src/db/schema/appointments.ts`).
      AC: FK unique on request_id; cascade delete policy documented.
      Deps: T022
      Effort: S
      Links: data-model.md (Appointment)
- [x] T024 Auth service (register/login) (`backend/src/services/authService.ts`) using better-auth + bcrypt hashing strategy.
      AC: Passes T007,T008,T016 scenarios.
      Deps: T020
      Effort: M
      Links: contracts (auth), research.md (auth)
- [x] T025 User profile service (`backend/src/services/userService.ts`) update fields with validation.
      AC: Passes T009,T010.
      Deps: T020,T024
      Effort: S
      Links: contracts (user)
- [x] T026 Service management service (`backend/src/services/serviceService.ts`) create/list with role checks.
      AC: Passes T011,T012,T017.
      Deps: T021,T024
      Effort: M
      Links: contracts (service), data-model.md
- [x] T027 Appointment workflow service (`backend/src/services/appointmentService.ts`) create request, list requests by user/role, update status with double-book prevention.
      AC: Passes T013–T015,T018.
      Deps: T022,T023,T024,T026
      Effort: L
      Links: contracts (appointment), data-model.md (business rules)
- [x] T028 Express app setup (`backend/src/app.ts`) include JSON body parsing, cors, helmet, rate-limit, logging middleware stub.
      AC: Imports routes only (no logic duplication); health route green.
      Deps: T024–T027
      Effort: S
      Links: plan.md (performance/security)
- [x] T029 Route layer + oRPC adapter (`backend/src/routes/*.ts`) mapping endpoints to services with Zod validation.
      AC: All contract tests pass (except integration-specific flows).
      Deps: T028
      Effort: M
      Links: contracts/api-contracts.ts
- [x] T030 Error handling & response normalization (`backend/src/middleware/errorHandler.ts`).
      AC: Known validation/auth errors standardized; tests updated to assert shape.
      Deps: T029
      Effort: S
      Links: research.md (error handling)
- [x] T031 Logging middleware structured JSON (`backend/src/middleware/logging.ts`).
      AC: Logs request id, timing, user id when present.
      Deps: T028
      Effort: S
      Links: plan.md (Observability)
- [x] T032 Auth middleware / token verification (`backend/src/middleware/auth.ts`).
      AC: Protects authenticated routes, ties into better-auth issued tokens.
      Deps: T024
      Effort: M
      Links: contracts (auth)

## Phase 3.4: Frontend Tests First (Schemas & API Layer)

- [x] T033 Frontend shared API client scaffolding (`frontend/src/lib/api/client.ts`) using oRPC client patterns (placeholder endpoints; tests failing).
      Deps: T003
      Effort: S
      Links: contracts/api-contracts.ts
- [x] T034 [P] MSW handlers draft for auth/services/appointments endpoints (`frontend/src/mocks/handlers.ts`) mirroring contracts; return 501 initially.
      Deps: T033
      Effort: S
      Links: contracts
- [x] T035 Integration test: auth flow UI (`frontend/tests/integration/auth.flow.spec.ts`) register → login → profile fetch (GREEN).
      Deps: T033,T034
      Effort: M
      Links: authProcedures.\*
- [x] T036 Integration test: service list & create (manager) UI (`frontend/tests/integration/services.flow.spec.ts`).
      Deps: T033,T034
      Effort: M
      Links: serviceProcedures.\*
- [x] T037 Integration test: appointment request lifecycle UI (`frontend/tests/integration/appointments.flow.spec.ts`).
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
- [x] T048 Double-booking enforcement test (`backend/tests/integration/appointments.doublebooking.spec.ts`) ensures second overlapping approval fails.
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

---

## Phase 3.8: Review Follow-ups (Post-Review Tasks)

These tasks are derived from the Code Review (2025-09-17) section in `plan.md`. They address contract mismatches, schema duplication, conflict handling, and security hardening to achieve merge readiness.

- [x] T060 Align contract transport types for dates/times (specs/contracts)
      AC: Replace `z.date()` with `z.string().datetime()` for transport fields (`createdAt`, `updatedAt`, etc.), or adopt `z.coerce.date()` consistently; update any dependent schemas and OpenAPI generation.
      Files: `specs/001-build-an-web/contracts/api-contracts.ts`
      Deps: T007–T015 (tests exist)
      Effort: M
      Links: plan.md (Review → Critical Issues #2)

- [x] T061 Update backend tests to match transport types
      AC: Contract tests parsing updated to new types; failing assertions due solely to type mismatch now pass or fail for functional reasons only.
      Files: `backend/tests/contract/*.spec.ts`, `backend/tests/integration/*.spec.ts`
      Deps: T060
      Effort: S

- [x] T062 Remove duplicate Drizzle schema and unify
      AC: Delete `backend/src/db/schema/appointmentRequests.ts` or `appointment_requests.ts` keeping a single canonical file; ensure enums and column types align with chosen contracts; generate fresh migration if needed.
      Files: `backend/src/db/schema/appointment_requests.ts`, `backend/src/db/schema/appointmentRequests.ts`
      Deps: T019–T023
      Effort: M
      Links: plan.md (Review → Critical Issues #3)

- [x] T063 Ensure double-booking returns 409
      AC: When approving a request that conflicts with an existing approved slot (same `serviceId`, `requestedDate`, `requestedTime`), API returns 409 with `{ error: 'conflict' }` shape; add focused test.
      Files: `backend/src/services/appointmentService.ts`, `backend/src/routes/appointments.ts`, `backend/tests/integration/appointments.doublebooking.spec.ts`
      Deps: T027, T018
      Effort: M
      Links: plan.md (Review → Critical Issues #4)

- [ ] T064 Add express-rate-limit with env overrides
      AC: Rate limiting enabled with sane defaults; configuration via `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` env vars; excluded in test env.
      Files: `backend/src/app.ts`, `.env.example`
      Deps: T028
      Effort: S

- [ ] T065 Enforce JWT secret in production
      AC: App startup throws when `NODE_ENV=production` and `JWT_SECRET` is missing or default; tests updated to set a test secret.
      Files: `backend/src/services/authService.ts`, `backend/src/app.ts`
      Deps: T024, T028
      Effort: S

- [ ] T066 Tighten validateBody typing with generics
      AC: `validateBody<T extends ZodTypeAny>(schema: T)` infers `z.infer<T>`; improved type safety across routes without breaking existing code.
      Files: `backend/src/middleware/validate.ts`
      Deps: T029
      Effort: S

- [ ] T067 Add request ID correlation to logging
      AC: Middleware reads `x-request-id` or generates UUID v4; logs request/response with `requestId`; tests assert presence.
      Files: `backend/src/middleware/logging.ts`, `backend/tests/integration/logging.spec.ts`
      Deps: T031
      Effort: S

- [ ] T068 Lazy DB initialization for test/dev
      AC: Guard `db` initialization so importing `app.ts` in tests doesn't require `DATABASE_URL`; only connect when actually needed or when env flag set.
      Files: `backend/src/db/index.ts`, `backend/src/app.ts`
      Deps: T019, T028
      Effort: M

- [ ] T069 Restrict CORS in production
      AC: Allowlist origins via `CORS_ORIGINS` env in production; dev remains permissive; document behavior.
      Files: `backend/src/app.ts`, `.env.example`, `backend/README.md`
      Deps: T028
      Effort: S

- [ ] T070 Generate OpenAPI from Zod contracts
      AC: Use `zod-openapi` to produce `openapi.json` matching contracts; add script `pnpm --filter backend openapi` and commit artifact or build step.
      Files: `shared/` or `backend/` script location, `package.json` scripts
      Deps: T060, T029
      Effort: M

- [ ] T071 Update quickstart with env + rate limit notes
      AC: `specs/001-build-an-web/quickstart.md` documents required env vars (`JWT_SECRET`, `DATABASE_URL`, rate limit), how to run tests, and how to run the server.
      Files: `specs/001-build-an-web/quickstart.md`
      Deps: T064, T065, T068, T069
      Effort: S

- [ ] T072 Backend API README updates
      AC: Endpoint list with auth/roles, error shapes for 401/403/409; link to generated OpenAPI.
      Files: `backend/README.md`
      Deps: T063, T070
      Effort: S

- [ ] T073 Regression test for PATCH schema validation
      AC: Add a unit/contract test ensuring `PATCH /appointments/requests/:id` validation uses `UpdateAppointmentRequestSchema` directly and rejects extraneous fields.
      Files: `backend/tests/contract/appointments.requests.patch.spec.ts`
      Deps: T015
      Effort: S

- [ ] T074 Normalize time format handling
      AC: Ensure `requestedTime` consistently uses `HH:MM` 24h format; add schema `.regex` if missing and update service normalization.
      Files: `specs/001-build-an-web/contracts/api-contracts.ts`, `backend/src/services/appointmentService.ts`
      Deps: T060, T027
      Effort: S

- [ ] T075 CI: Add backend test workflow badge and ensure green
      AC: GitHub Actions workflow runs backend tests on PR; badge added to root README; ensure tasks from this section pass.
      Files: `.github/workflows/ci.yml`, `README.md`
      Deps: T058, T061–T074
      Effort: M

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

Generated September 12, 2025 from branch `001-build-an-web`. Status sync updated September 19, 2025.
