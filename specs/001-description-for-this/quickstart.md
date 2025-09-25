# Quickstart – Complete UI polish for appointment scheduling app

Follow these steps to review, develop, and validate the UI during this feature cycle.

## 1. Prerequisites

- Node.js 20+
- `pnpm` (workspace root already configured)
- Access to the forthcoming "Scheduling UI PRD" document (Notion export) for page goals and KPIs

## 2. Install and Configure Shadcn UI + Darkmatter Theme

```powershell
# From repo root
pnpm install
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest mcp init --client vscode
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json
```

- Generated components land in `frontend/src/components/ui`
- Merge the theme tokens into `frontend/tailwind.config.js` and `frontend/src/lib/theme.ts`
- Verify the Tailwind IntelliSense restart picks up new tokens

## 3. Seed Mock Data and Handlers

```powershell
pnpm -C frontend run msw:generate
```

- Creates `frontend/src/mocks/data.ts` with deterministic Faker factories (seed `20250925`)
- MSW handlers live in `frontend/src/mocks/handlers` mirroring backend endpoints
- Update handlers whenever backend contracts change; tests will fail if schemas drift

## 4. Run the App with Mock Backend

```powershell
pnpm -C frontend dev
```

- The MSW service worker boots automatically in development; ensure the browser accepts the registration prompt
- Navigation across all ten pages should display realistic data, countdown timers, and manager approval queues

## 5. Execute Test Suites

```powershell
pnpm -C frontend test        # Vitest unit + component tests
pnpm -C frontend test:e2e    # Playwright smoke covering core flows
pnpm -C backend test:db      # Ensures backend schema stays aligned (optional but recommended)
```

- Contract tests under `specs/001-description-for-this/contracts/tests` must fail until MSW handlers and components satisfy the documented schemas (P5 requirement)

## 6. Visual + Accessibility Regression Checks

```powershell
pnpm -C frontend run storybook
```

- Capture Darkmatter theme snapshots for each Shadcn component used on the ten pages
- Run axe-core via the Storybook accessibility tab and remediate violations immediately

## 7. Hand-off Checklist

- UI PRD updated with screenshots, KPIs, and outstanding feedback
- All tests pass locally
- Quickstart steps documented in PR description, including theme/token diffs
- Telemetry events validated via browser console (MSW logs missing handlers)
