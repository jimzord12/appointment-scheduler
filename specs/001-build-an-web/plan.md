# Implementation Plan: Appointment Management Web Application

**Branch**: `001-build-an-web` | **Date**: September 12, 2025 | **Spec**: c:\Github\appointment-scheduler\specs\001-build-an-web\spec.md

**Input**: Feature specification from `/specs/001-build-an-web/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command

## Phase 2 Planning
The /tasks command will generate tasks.md by analyzing the data model, API contracts, and feature requirements. Tasks will be broken down into:

- Backend implementation tasks (database setup, API routes, authentication)
- Frontend implementation tasks (components, pages, routing, state management)
- Integration tasks (API integration, testing, deployment setup)

Each task will include:
- Description and acceptance criteria
- Dependencies on other tasks
- Estimated effort
- Links to relevant specs and contracts

Tasks will follow the RED-GREEN-Refactor TDD cycle, ensuring tests are written before implementation.
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Build a web application for small businesses like hair salons to manage appointments. Users can create accounts and request appointments, which managers approve. Technical approach: React 19 frontend with Vite 7, Express.js 5 backend with Node.js 22, TypeScript 5 throughout, Drizzle ORM with PostgreSQL, better-auth for authentication, oRPC for end-to-end type safety, Zustand + TanStack Query for state management, TailwindCSS 4 for styling, shadcn for UI components, comprehensive testing with Vitest and MSW.

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: Vite 7, React 19, Express.js 5, TanStack Router 1, TailwindCSS 4, shadcn 3, oRPC 1, Drizzle 0, better-auth 1, Zustand 5, TanStack Query 5, React Hook Form 7, date-fns 4, Zod 4, zod-openapi 5
**Storage**: PostgreSQL for production, SQLite for development
**Testing**: Vitest 3, React Testing Library 16, supertest 7, msw 2
**Target Platform**: Web browser (modern browsers supporting ES2020+)
**Project Type**: web (frontend + backend)
**Performance Goals**: Response time <2s for appointment operations, <500ms for UI interactions
**Constraints**: Small business scale (10-100 concurrent users), no high availability requirements
**Scale/Scope**: Small business (hair salon), 10-100 users, simple appointment management

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Simplicity**:

- Projects: [#] (max 3 - e.g., api, cli, tests)
- Using framework directly? (no wrapper classes)
- Single data model? (no DTOs unless serialization differs)
- Avoiding patterns? (no Repository/UoW without proven need)

**Architecture**:

- EVERY feature as library? (no direct app code)
- Libraries listed: [name + purpose for each]
- CLI per library: [commands with --help/--version/--format]
- Library docs: llms.txt format planned?

**Testing (NON-NEGOTIABLE)**:

- RED-GREEN-Refactor cycle enforced? (test MUST fail first)
- Git commits show tests before implementation?
- Order: Contract→Integration→E2E→Unit strictly followed?
- Real dependencies used? (actual DBs, not mocks)
- Integration tests for: new libraries, contract changes, shared schemas?
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:

- Structured logging included?
- Frontend logs → backend? (unified stream)
- Error context sufficient?

**Versioning**:

- Version number assigned? (MAJOR.MINOR.BUILD)
- BUILD increments on every change?
- Breaking changes handled? (parallel tests, migration plan)

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

**Structure Decision**: [DEFAULT to Option 1 unless Technical Context indicates web/mobile app]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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

**Phase Status**:

[x] Phase 0: Research complete (/plan command)
[x] Phase 1: Design complete (/plan command)
[ ] Phase 2: Task planning complete (/plan command - describe approach only)
[x] Phase 3: Tasks generated (/tasks command)
[x] Phase 4: Implementation in progress
[ ] Phase 5: Validation passed

**Implementation Progress**:

- [x] T001: Monorepo structure initialized (backend/, frontend/, shared/, shared/README.md, package.json workspaces)
- [x] T006: Schema scaffolding added (backend/src/schemas) re-exporting contract Zod schemas
- [x] T007–T010: Contract tests authored (auth register/login, user profile get/patch) now enforcing success/validation expectations and FAILING (proper RED state established)
- [x] T011–T015: Remaining contract tests (services list/create, appointment requests get/post/patch) authored and FAILING (RED layer complete for all individual endpoints)
- [x] T016–T018: Integration flow tests (auth, services, appointments lifecycle) authored and FAILING (full Phase 3.2 RED coverage established; blocked until backend implementation tasks T019+)
      // Phase 3.3 (Backend Core Implementation)
- [x] T019: Database config & Drizzle setup (db connection, drizzle config, migration scripts scaffolding)
- [x] T020: User schema + model (users table with unique email index + role index)
- [x] T021: Service schema + model (services table with indexes, defaults)
- [x] T022: AppointmentRequest schema + model (appointment_requests table with status/date/user/service indexes)
- [x] T023: Appointment schema + model (appointments table with unique FK on request_id)

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
