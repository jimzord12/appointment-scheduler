# Phase 0 Research – Complete UI polish for appointment scheduling app

All unknowns highlighted in the plan have been investigated. Decisions, rationales, and alternatives are captured below to guide design and implementation.

## 1. UI PRD Structure for Ten Pages

- **Decision**: Build a shared "Scheduling UI PRD" in Notion (exportable to Markdown) with one section per page capturing goal, primary action, supporting KPIs, personas, success metrics, and P1/P2 guardrails.
- **Rationale**: Centralizes the authoritative goals required by FR-009, keeps stakeholders aligned, and mirrors the constitution by explicitly tracking one-appointment and approval flows.
- **Alternatives Considered**:
  - Spreadsheet tracker — rejected because it does not capture narrative UX context or acceptance narratives well.
  - Inline README pages — rejected to avoid scattering critical product knowledge across the repo.

## 2. Shadcn UI v3 with Tailwind 4 + Darkmatter Theme

- **Decision**: Install Shadcn UI via `pnpm dlx shadcn@latest init`, immediately add the MCP server with `pnpm dlx shadcn@latest mcp init --client vscode`, generate components into `frontend/src/components/ui`, then import the Darkmatter tokens via `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json`. Tailwind v4 configuration will be expressed in the global stylesheet (`frontend/src/index.css`) instead of the deprecated `tailwind.config.js`, with helper utilities exposed through `frontend/src/lib/theme.ts`.
- **Rationale**: Matches constitution stack (P4), keeps Shadcn upgrades manageable, and centralizes theme overrides in CSS to satisfy rapid visual changes while honoring Tailwind v4 conventions.
- **Alternatives Considered**:
  - Manual component library build — rejected as it would slow delivery and risk inconsistency.
  - Using Material UI — rejected due to mismatch with mandated tech and theming effort.

## 3. MSW Architecture Aligned with Backend Contracts

- **Decision**: Mirror backend OpenAPI endpoints (`/appointments`, `/services`, `/user/profile`) in MSW handlers located under `frontend/src/mocks/handlers`, using Zod schemas shared from `shared/contracts` to validate mock payloads before responding.
- **Rationale**: Preserves contract parity (P4), enables easy switch to live backend later, and ensures MSW responses uphold one-appointment and manager approval logic (P1/P2).
- **Alternatives Considered**:
  - Ad-hoc MSW handlers with inline types — rejected due to drift risk.
  - JSON fixture files — rejected because Faker-driven realism and countdown timers are required.

## 4. Faker v10 Seeding Strategy

- **Decision**: Implement deterministic data seeding using `faker.seed(20250925)` and helper factories that enforce single active appointment per customer and include pending approvals; expose seeds via `frontend/src/mocks/data.ts`.
- **Rationale**: Deterministic seeds make tests reliable (P5) while honoring booking policies (P1) and manager workflows (P2).
- **Alternatives Considered**:
  - Random seed per session — rejected because it introduces flaky tests and inconsistent demos.
  - Static hand-written records — rejected for lacking variety and realism.

## 5. Calendar Accessibility, Localization, and Reduced Motion

- **Decision**: Adopt WCAG 2.2 AA checklist for calendar interactions, ensure keyboard/ARIA support using Radix primitives, provide EN/EL translation keys in `frontend/src/locales`, and respect the user's reduced-motion preference by disabling auto-animated transitions.
- **Rationale**: Directly satisfies the Calendar-First principle (P3) and keeps UI accessible across personas.
- **Alternatives Considered**:
  - Deferring accessibility to later — rejected due to constitutional requirements and high rework risk.
  - Using third-party calendar widget — rejected to maintain control over styling and policies.
