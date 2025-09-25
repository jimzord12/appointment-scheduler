# Implementation Plan: Complete UI polish for appointment scheduling app

**Branch**: `001-description-for-this` | **Date**: September 25, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-description-for-this/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Deliver a production-ready UI experience across all ten scheduling pages while the backend matures. We will formalize a shared UI PRD (checked into `specs/001-description-for-this/ui-prd.md`), maintain a review log for stakeholder feedback, stand up MSW-driven mock APIs aligned with the backend contracts, adopt Shadcn UI with the Darkmatter theme via Tweakcn, and ensure every page exhibits consistent, accessible visuals and realistic interactions. A mock-to-live transition playbook will capture the steps for swapping MSW with real APIs as backend coverage comes online.

## Technical Context

**Language/Version**: React 19, TypeScript 5.x, Node.js 20+ (MSW tooling)
**Primary Dependencies**: Shadcn UI v3 (Radix primitives), Tailwind CSS 4 with Tweakcn Darkmatter theme (configured via global CSS instead of `tailwind.config.js`), MSW, Faker v10, TanStack Router 1, TanStack Query 5, Zustand 5, React Hook Form 7, Zod 4
**Storage**: In-memory mock data generated via Faker (aligned with PostgreSQL-backed contracts)
**Testing**: Vitest + React Testing Library for unit/interaction, Playwright for end-to-end visual validation, MSW handlers exercised in tests
**Target Platform**: Web (modern evergreen browsers, responsive breakpoints)
**Project Type**: Web application (frontend + backend monorepo; frontend focus this feature)
**Performance Goals**: Page navigation and primary action feedback under 500 ms, theme swap under 100 ms, mock API responses within 50 ms simulated latency
**Constraints**: Must remain fully functional offline from backend, uphold accessibility (keyboard, ARIA, reduced motion), integrate Darkmatter tokens centrally, and reuse shared booking policies
**Scale/Scope**: Ten customer- and manager-facing pages, supporting customer, stylist, and manager personas with realistic workloads (~200 appointments/day simulated)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **P1 – One-Appointment Policy**: Confirm workflows keep one active appointment per customer, include confirmation + countdown UX, and surface any new data fields in contracts.
- **P2 – Manager-Governed Approvals**: Ensure new flows preserve pending → approve/reject lifecycle and note customer/manager notifications.
- **P3 – Calendar-First Experience**: Capture calendar/UI implications (accessibility, localization, reduced motion) within design notes and acceptance criteria.
- **P4 – Modern Typed Stack Discipline**: Verify chosen libraries/versions stay within mandated ranges and that shared contracts/Zod schemata stay authoritative.
- **P5 – Quality & Observability Gates**: List the automated tests, logging, and telemetry updates needed; plan must show how required test suites will run in CI and locally.

Document any variance along with mitigation or follow-up tasks before advancing.

- **P1 – One-Appointment Policy**: UI mocks will enforce single-active-appointment logic (hiding booking CTA when countdown active) and include confirmation + countdown components in Shadcn design. Contracts expose `activeAppointment` state to MSW handlers so tests guard the policy.
- **P2 – Manager-Governed Approvals**: Pending/approve/reject flows remain visible in manager pages, with mock endpoints modeling notification events. Quickstart will note manager review checkpoints.
- **P3 – Calendar-First Experience**: Calendar remains above the fold with accessible shortcuts; theme tokens include reduced-motion variants and Darkmatter palette. Research covers localization and calendar UX validation.
- **P4 – Modern Typed Stack Discipline**: Plan keeps within mandated TypeScript/React/Tailwind versions, generates Zod schemas for mock data, and ensures contracts reuse shared types.
- **P5 – Quality & Observability Gates**: Tests include Vitest component coverage, Playwright journeys, and logging hooks for mock API gaps. Quickstart will list CI commands to run.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 – Web application (frontend + backend) with primary work in `frontend/` and MSW mocks under `frontend/src/mocks`.

## Phase 0: Outline & Research

1. Synthesize authoritative UI PRD framework covering ten pages (roles, KPIs, success metrics) so design and QA align with FR-009, storing the artifact in `specs/001-description-for-this/ui-prd.md` (export from Notion as Markdown).
2. Document best practices for installing Shadcn UI v3 into the existing Vite + Tailwind 4 stack, running both `pnpm dlx shadcn@latest init` and `pnpm dlx shadcn@latest mcp init --client vscode`, and integrating Darkmatter tokens via Tweakcn while routing configuration through the global CSS entry (Tailwind v4).
3. Validate MSW architecture for mirroring backend contracts (appointments, services, user profile) including countdown fields, pending states, and notification hooks.
4. Identify Faker v10 strategies to generate deterministic mock datasets respecting the one-appointment rule and manager approval lifecycle.
5. Review accessibility, localization (EN/EL), and reduced-motion expectations for the calendar-first experience to ensure page designs meet P3.
6. Outline the checkpoints, toggles, and telemetry expectations for the mock-to-live transition playbook so delivery teams can rehearse the cut-over safely.

Research dispatch examples:

```
Task: "Outline UI PRD structure covering 10 appointment pages and KPIs"
Task: "Best practices for integrating Shadcn UI v3 with Tailwind 4 + Darkmatter theme"
Task: "Design MSW handler architecture aligned with existing appointment API contracts"
Task: "Faker v10 seeding patterns for deterministic scheduling datasets"
Task: "Calendar accessibility and localization checklist for Darkmatter theme"
```

`research.md` will record each decision with rationale and alternatives.

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. Capture data entities and states in `data-model.md`: appointments (with countdown + status), services, users, theme tokens, notification events, and page interaction definitions referencing the upcoming PRD.
2. Author MSW-aligned API contracts in `/specs/001-description-for-this/contracts/mock-scheduling-api.yaml` covering GET/POST `/appointments`, PATCH `/appointments/:id/status`, GET `/services`, GET/PATCH `/user/profile`, and notification stub endpoints; ensure schemas mirror backend expectations and include manager approval states.
3. Draft contract test stubs (Vitest) outlining expected request/response validation per endpoint under `/specs/001-description-for-this/contracts/tests/`. Tests will refer to Zod schemas to keep P4 intact and initially fail until implementation.
4. Translate user journeys into Playwright quickstart scenarios within `quickstart.md`, detailing navigation across ten pages, theme swap verification, and MSW fallback validation.
5. Capture the initial stakeholder review loop expectations in `specs/001-description-for-this/ui-feedback-log.md`, including cadence, reviewers, and acceptance gates tied to FR-007.
6. Produce the first iteration of `specs/001-description-for-this/mock-to-live-playbook.md`, documenting mock shutdown steps, contract validation tooling, and rollback signals.
7. Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot` after artifacts are generated so repository-wide assistance reflects new dependencies and design notes.

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base.
- Create tasks to author the UI PRD, finalize research decisions, and codify theme tokens before coding.
- Map each contract endpoint to a contract test task [P], each data entity to a TypeScript model/store update task, and each page to paired UI + test tasks.
- Include cross-cutting tasks for MSW handlers, theme integration, accessibility audits, and telemetry hooks.

**Ordering Strategy**:

- Maintain TDD flow: define contracts/tests before implementing UI or mocks.
- Sequence shared foundations first (theme tokens, PRD, MSW handlers) before page-specific work.
- Use [P] for parallelizable page polishing tasks once shared infrastructure is stable.

**Estimated Output**: ~28 tasks capturing foundation, mocks, per-page polish, and QA validation.

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

- **Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v1.0.0 – See `.specify/memory/constitution.md`_
