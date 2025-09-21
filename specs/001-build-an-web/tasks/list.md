---
description: Complete task list by phases for 001-build-an-web. Duplicates removed and mapped to replacements.
---

# Full Task List — 001-build-an-web (All Phases)

## Deduplication Note

Replaced older follow-up task IDs with consolidated equivalents:

- T064 → T078 (rate limiting)
- T065 → T079 (JWT secret)
- T067 → T081 (request ID)
- T068 → T084 (lazy DB init)
- T069 → T080 (CORS)
- T070 → T082 (OpenAPI)

References to T064/T065/T067/T068/T069/T070 should use their replacements.

---

## Phase 3.1: Repository & Environment Setup

- [x] T001 Initialize monorepo structure (backend/, frontend/, shared/README.md)
- [x] T002 Backend TypeScript setup (Express 5, Zod, Drizzle, etc.)
- [x] T003 Frontend Vite React TS setup
- [x] T004 Root linting & formatting configured
- [x] T005 Environment configuration

## Phase 3.2: Tests First (Backend Contracts & Models)

- [x] T006 Shared Zod schema export scaffolding (backend/src/schemas)
- [x] T007–T015 Contract tests (auth, user, services, appointments)
- [x] T016–T018 Integration tests (auth, services, appointments lifecycle)

## Phase 3.3: Backend Core Implementation

- [x] T019 DB config & Drizzle setup
- [x] T020–T023 Models (users, services, appointment_requests, appointments)
- [x] T024–T027 Services (auth, user, service, appointment)
- [x] T028–T032 App, routes, error handling, logging, auth middleware

## Phase 3.4: Frontend Tests First (Schemas & API Layer)

- [x] T033 API client scaffolding
- [x] T034 MSW handlers
- [x] T035–T037 Integration tests (auth/services/appointments UI)

## Phase 3.5: Frontend Core Implementation

- [ ] T038 Auth store
- [ ] T039 Services store
- [ ] T040 Appointments store
- [ ] T041 Auth pages/components
- [ ] T042 Services management UI
- [ ] T043 Appointment request UI
- [ ] T044 Routing with TanStack Router
- [ ] T045 API hooks with TanStack Query
- [ ] T046 UI polish & shadcn components integration

## Phase 3.6: Cross-Cutting Integration & Hardening

- [ ] T047 Security hardening verification
- [x] T048 Double-booking enforcement test
- [ ] T049 Backend performance tests
- [ ] T050 Frontend bundle analysis script
- [ ] T051 Logging validation test
- [ ] T052 Accessibility tests

## Phase 3.7: Polish & Documentation

- [ ] T053 Utility/date validation unit tests
- [ ] T054 Frontend form validation unit tests
- [ ] T055 Quickstart updates
- [ ] T056 Backend API README
- [ ] T057 Clean duplication & refactors
- [ ] T058 Final CI pipeline config
- [ ] T059 Release prep

## Phase 3.8: Review Follow-ups

- [x] T060 Align date/time transport types
- [x] T061 Update backend tests to match transport
- [x] T062 Remove duplicate Drizzle schema and unify
- [x] T063 Double-booking returns 409
- [x] T066 Tighten validateBody typing
- [x] T071 Quickstart env + rate limit notes
- [x] T072 Backend API README updates
- [ ] T073 Regression test for PATCH schema
- [ ] T074 Normalize time format handling
- [ ] T075 CI: Add backend test workflow badge

## Phase 3.9: Current Increment

Backend

- [x] T076 Remove duplicate Drizzle schema for appointment requests
- [x] T077 DB-backed AppointmentRequest/Appointment services
- [x] T078 Rate limiting with env controls
- [x] T079 Enforce JWT secret in production
- [x] T080 Restrict CORS in production
- [x] T081 Request ID correlation logging
- [x] T082 Generate OpenAPI from Zod contracts
- [x] T083 Migrate User/Service services to DB
- [x] T084 Lazy DB initialization for tests

Frontend

- [x] T085 Auth pages (RHF + Zod)
- [x] T086 Services list + create (manager-only)
- [x] T087 Appointment request form & list
- [x] T088 Manager approval workflow UI
- [x] T089 Routing + protected routes
- [x] T090 Loading/Error UX + a11y pass

Integration, Testing, DevOps

- [x] T091 Stabilize contract tests for transport types
- [x] T092 E2E happy path (MSW off)
- [x] T093 Quickstart + backend README
- [x] T094 CI: lint, typecheck, tests, OpenAPI artifact
- [x] T095 Seed + local dev DB automation
