<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles:
- N/A → I. One-Appointment Policy
- N/A → II. Manager-Governed Approvals
- N/A → III. Calendar-First Experience
- N/A → IV. Modern Typed Stack Discipline
- N/A → V. Quality & Observability Gates
Added sections:
- Core Principles
- Platform & Technology Standards
- Delivery Workflow & Quality Gates
- Governance
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/* N/A (no command templates present)
Follow-up TODOs: none
-->

# Appointment Scheduler Constitution

## Core Principles

### I. One-Appointment Policy

- Customers MUST have no more than one active appointment. Backend services enforce this rule and reject conflicting writes; frontend flows hide booking affordances while an appointment is active.
- Every booking, update, or cancellation MUST present a summary of date, time, and service, collect explicit confirmation, and emit a success notification.
- Confirmed appointments MUST display a live countdown timer in the dashboard until the scheduled start time.

Rationale: Eliminating double bookings and maintaining a single source of truth keeps stylists scheduled accurately and customers confident in the status of their visit.

### II. Manager-Governed Approvals

- All new appointment requests MUST enter a `pending` state until a manager approves or rejects them; direct confirmation paths are prohibited.
- Managers MUST receive timely visibility into pending requests (dashboard queue today; extendable to notifications) and their actions MUST notify customers of the outcome.
- Only the designated admin can create manager accounts; all other role escalations are rejected.

Rationale: Manager review protects staffing capacity, prevents abuse, and preserves clear accountability for schedule changes.

### III. Calendar-First Experience

- When no active appointment exists, the primary UI MUST render the calendar component above the fold, highlighting availability and enabling booking in ≤3 interactions.
- Calendar and booking components MUST remain accessible (keyboard focus, ARIA labels) and responsive across device breakpoints.
- Localization (EN/EL), theme, and reduced-motion preferences MUST immediately influence calendar interactions and transitions.

Rationale: A beautiful, intuitive calendar is the heart of the product; investing in UX and accessibility keeps conversion high and supports diverse customers.

### IV. Modern Typed Stack Discipline

- Frontend MUST ship on React 19, Vite 7, TypeScript 5, Tailwind CSS 4, TanStack Router 1, TanStack Query 5, Zustand 5, React Hook Form 7, and Zod 4 or later compatible minor releases; upgrades follow semver with changelog review.
- Backend MUST stay on Node.js 20+, Express 5, TypeScript 5, Drizzle ORM 0.30+, Zod 4+, better-auth 1+, and pg 8+. Integrations (e.g., `better-auth/adapters/drizzle`) MUST remain the preferred adapters.
- API contracts, shared types, and OpenAPI definitions MUST be generated from Zod schemas to keep single-source truth between backend and frontend.

Rationale: A consistent, up-to-date stack reduces integration friction, keeps performance modern, and preserves type safety end-to-end.

### V. Quality & Observability Gates

- All changes MUST include automated tests matching scope: Vitest unit/integration, Playwright end-to-end, Supertest for HTTP, and Testcontainers for DB flows when data persistence is touched.
- CI pipelines MUST fail fast on lint, type-check, formatting, and contract drift; contributors run the same commands locally before PR.
- Backend MUST emit structured logs and honor rate limiting defaults; frontend MUST instrument critical UI states with accessible telemetry hooks when available.

Rationale: High-confidence releases demand observable systems and regression coverage so salon staff can rely on every deploy.

## Platform & Technology Standards

- Monorepo uses `pnpm` workspaces; lockfile updates accompany dependency bumps.
- Environment parity: local, CI, and production run Node.js 20+, PostgreSQL 16, and shared `.env` conventions (`DATABASE_URL`, rate-limit flags).
- Authentication flows rely on Better Auth; password hashing uses `bcryptjs` v3+; JWT secrets MUST be strong in production.
- Shared contracts live under `shared/contracts/api-contracts.ts` and MUST be the only source for client/server API typing.
- Accessibility reviews include axe-core audits and localization snapshots on primary flows.

## Delivery Workflow & Quality Gates

- Every work item starts with an updated plan template referencing relevant principles and enumerating acceptance tests.
- Pull requests MUST link to generated API contract diffs and include evidence of required test suites (`pnpm -C backend test`, `pnpm -C backend run test:db`, `pnpm -C frontend test`, `pnpm -C frontend test:e2e`).
- Before merge, reviewers confirm calendar UX screenshots or recordings for customer-facing changes and validate manager dashboard behavior for approval features.
- Production deploys require a dry run against staging data, confirmation that countdown timers render correctly, and verification that notifications reach both customer and manager channels.

## Governance

- This constitution overrides conflicting documentation. Amendments require a PR referencing impacted principles, updated templates, and a semantic version bump noted in `CHANGELOG.md`.
- A compliance reviewer (rotating weekly) signs off that principles, stack standards, and workflow gates remain satisfied before merging feature PRs.
- Semantic versioning: MAJOR for principle removals or conflicting policy shifts, MINOR for new principles/sections or materially expanded guidance, PATCH for clarifications. Record ratification and amendment dates in ISO format.
- Quarterly reviews assess adherence metrics (test coverage, SLA for approvals, UX accessibility audits) and propose revisions when gaps appear.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25
