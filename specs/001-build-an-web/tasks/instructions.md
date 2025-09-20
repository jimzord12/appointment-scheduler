---
description: Execution instructions, legend, dependency graph, parallel examples, validation checks, effort totals, and notes for 001-build-an-web.
---

# Tasks: 001-build-an-web — Appointment Management Web App

Branch: `001-build-an-web`
Input (Implementation Plan): `c:\Github\appointment-scheduler\specs\001-build-an-web\plan.md`
Specs Dir: `c:\Github\appointment-scheduler\specs\001-build-an-web`
Contracts: `c:\Github\appointment-scheduler\specs\001-build-an-web\contracts\api-contracts.ts`

Template: `/templates/tasks-template.md`
Task Generation Date: 2025-09-20

Guiding Principles:

- TDD: Write/adjust tests first (RED), implement to pass (GREEN), then refactor.
- Traceability: Each task links to specs/contracts and references dependencies.
- Parallelization: Tasks marked [P] can run in parallel.

Links:

- Spec: `c:\Github\appointment-scheduler\specs\001-build-an-web\spec.md`
- Research: `c:\Github\appointment-scheduler\specs\001-build-an-web\research.md`
- Data Model: `c:\Github\appointment-scheduler\specs\001-build-an-web\data-model.md`
- Contracts: `c:\Github\appointment-scheduler\specs\001-build-an-web\contracts\api-contracts.ts`

---

## Execution Flow

1. Load `tasks/queue.md` to see in-progress and next tasks.
2. Open `tasks/list.md` to locate the exact task spec.
3. **IMPORTANT**: Execute in dependency order; only run tasks marked [P] in parallel.
4. Maintain RED→GREEN→REFACTOR. Commit failing tests before implementation.
5. Keep commits atomic (ideally one task per commit) and run lint/typecheck each time.

## Legend & Format

- Format: `[ID] [P?] Title`
- [P] = Parallelizable (distinct files/areas, no dependency)
- Each task includes: Description, Acceptance Criteria (AC), Dependencies (Deps), Effort (Est), Links
- Estimates: `XS ≈ 0.5h`, `S ≈ 1–2h`, `M ≈ 3–5h`, `L ≈ 1–2 days`

## Dependencies Summary (Graph Excerpts)

- T006 → T007–T015 → (Integration T016–T018) → Backend impl T019+
- Models chain: T019 → T020 → (T024,T025); T019 → T021 → T026; T019 → T022 → T023 → T027
- Services depend on respective models + auth
- Frontend tests (T033–T037) precede frontend state/UI (T038–T046)
- Hardening (T047–T052) after core backend/frontend
- Docs & polish after primary features stable

## Parallel Execution Examples

```
# Early contract tests (all [P])
T007 T008 T009 T010 T011 T012 T013 T014 T015

# After DB setup
T020 T021 T022 (while migrations generated), then T023

# Frontend integration tests
T035 T036 T037 (after T033,T034)
```

## Validation Checklist Mapping

- All contracts → tests T007–T015 (YES)
- All entities → models T020–T023 (YES)
- Tests precede implementation (Phases 3.2 before 3.3) (YES)
- Parallel tasks only independent distinct files (YES)
- Every implementation task references covering tests (YES via Deps & Links)

## Effort Totals (Rough)

- S: 32, M: 19, L: 4 (Total: 59)

## Notes

- One task ≈ one commit where feasible; ensure RED test committed before GREEN implementation.
- Re-run lint & typecheck on each commit.
- Consider extracting shared Zod types to `shared/` after backend stabilizes.
