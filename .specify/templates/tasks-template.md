# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup

- [ ] T001 Confirm prerequisite docs are up to date (plan, research, data-model, contracts) and reference relevant constitution principles.
- [ ] T002 Configure workspace tooling (lint, format, type-check) in both `backend/` and `frontend/` per plan decisions.
- [ ] T003 [P] Prepare seeded data or mocks required for appointment, service, and notification scenarios.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T004 [P] Backend contract tests for `/appointments/requests` create/update flows in `backend/tests/contract/` covering one-appointment enforcement.
- [ ] T005 [P] Backend integration test for manager approval lifecycle in `backend/tests/integration/appointments.flow.spec.ts` (pending → approved/rejected with notifications).
- [ ] T006 [P] Frontend integration test ensuring calendar renders availability when no active appointment (`frontend/tests/` as defined in plan).
- [ ] T007 [P] Frontend unit test verifying countdown timer component behavior when an appointment is active.
- [ ] T008 [P] Observability/regression tests (e.g., logging, rate limiting) when required by scope.

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T009 [P] Implement backend appointment service logic enforcing single active appointment and emitting status transitions.
- [ ] T010 [P] Build manager dashboard endpoints and authorization checks honoring admin-only manager creation rules.
- [ ] T011 [P] Implement notification delivery or stubs ensuring customer + manager updates fire on status changes.
- [ ] T012 Update frontend calendar screens to reflect availability, localization, and reduced-motion requirements.
- [ ] T013 Wire countdown timer component into customer dashboard with real-time updates.
- [ ] T014 Persist and expose shared types/contracts (`shared/contracts`) so frontend/backend stay in sync.

## Phase 3.4: Integration

- [ ] T015 Connect backend services to Drizzle/PostgreSQL (or mocks) ensuring pending/approved states persist correctly.
- [ ] T016 Integrate Better Auth adapters for role-based access and enforce manager-only actions.
- [ ] T017 Ensure structured logging, rate limiting, and request tracing meet observability gates.
- [ ] T018 Sync frontend with live API (React Query/Zustand flows) and invalidate caches after approvals.

## Phase 3.5: Polish

- [ ] T019 [P] Add unit tests for validation and edge cases (double-booking, invalid status transitions, localization fallbacks).
- [ ] T020 Accessibility + visual regression checks for calendar and countdown components.
- [ ] T021 [P] Update documentation (plan quickstart, API docs, changelog) noting constitutional principle coverage.
- [ ] T022 Run full test matrix (`pnpm -C backend test`, `pnpm -C backend run test:db`, `pnpm -C frontend test`, `pnpm -C frontend test:e2e`) and capture evidence.
- [ ] T023 Final manual QA checklist for notifications, countdown accuracy, and manager workflow.

## Dependencies

- Phase 3.2 tests (T004–T008) must exist and fail before beginning implementation tasks (T009–T014).
- T009 blocks database integration (T015) and contract syncing (T014).
- T010 blocks manager UI/API work (T018) and notification tasks (T011).
- Observability integration (T017) depends on service implementations (T009, T010).
- Polish tasks (T019–T023) depend on successful integration completion.

## Parallel Example

```
# Launch T004-T008 together (different files / suites):
Task: "Backend contract tests for /appointments/requests"
Task: "Backend integration test for manager approval lifecycle"
Task: "Frontend integration test for calendar availability"
Task: "Frontend countdown timer unit test"
Task: "Observability regression tests"
```

## Notes

- [P] tasks = different files, no dependencies
- Respect the constitution: tests first, manager approvals intact, calendar UX validated, stack dependencies managed.
- Verify tests fail before implementing
- Commit after each task with evidence of required test runs
- Avoid: vague tasks, same file conflicts, bypassing manager approval workflows

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Tasks explicitly cover constitutional principles they impact (P1–P5)
