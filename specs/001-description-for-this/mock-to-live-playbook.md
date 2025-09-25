# Mock-to-Live Transition Playbook

**Purpose**: Document the repeatable steps for replacing MSW mocks with the live scheduling backend while safeguarding the UI polish deliverable.

## 1. Prerequisites

- ✅ Backend exposes production-ready endpoints for `/appointments`, `/services`, `/user/profile`, `/notifications/manager`.
- ✅ OpenAPI contracts aligned between backend (`backend/openapi.json`) and shared contracts (`shared/contracts/api-contracts.ts`).
- ✅ Frontend MSW handlers achieve parity with contracts (no TODOs in handler files).
- ✅ All Vitest contract tests pass against MSW (`pnpm -C frontend test --filter "contracts"`).
- ✅ Performance harness (`pnpm -C frontend test:performance`) shows navigation < 500 ms and theme toggle < 100 ms.
- ✅ Stakeholder sign-off recorded in `ui-feedback-log.md` for go-live readiness.

## 2. Transition Checklist

| Step | Owner         | Command / Artifact                                                         | Notes                                              |
| ---- | ------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| 1    | Backend       | `pnpm -C backend run test:db`                                              | Validate DB migrations & seed data.                |
| 2    | Frontend      | `pnpm -C frontend exec tsx scripts/check-contract-parity.ts` _(future)_    | Ensure TypeScript contracts match backend schemas. |
| 3    | Frontend      | Toggle env var `VITE_USE_MOCKS=false` in `.env.production`                 | Controls MSW registration.                         |
| 4    | Frontend      | Remove MSW worker registration in `frontend/src/main.tsx` for prod build   | Guard with env check.                              |
| 5    | QA            | Run regression suite: `pnpm -C frontend test && pnpm -C frontend test:e2e` | Confirm UI stability without mocks.                |
| 6    | Observability | Enable API request logging and telemetry events for approvals and bookings | Ensure analytics module emits to prod sink.        |
| 7    | Release       | Update `CHANGELOG.md` mock-to-live section                                 | Document completion and lessons.                   |

## 3. Validation Scripts

```powershell
# Smoke test API availability
Invoke-WebRequest "$($env:BACKEND_URL)/health" -UseBasicParsing

# Contract diff (placeholder until script implemented)
pnpm -C shared exec ts-node scripts/diff-contracts.ts backend/openapi.json

# Performance benchmark (post-switch)
pnpm -C frontend test:performance --runInBand
```

## 4. Rollback Plan

1. Flip `VITE_USE_MOCKS=true` and redeploy frontend.
2. Restore MSW worker registration and restart service worker (`pnpm -C frontend run dev` for local validation).
3. Re-run contract tests against MSW to confirm mocks remain functional.
4. Log rollback context in `ui-feedback-log.md` and create follow-up tickets for backend gaps.

## 5. Observability & Alerts

- Monitor API error rate (target < 1% after go-live).
- Track manager decision latency from telemetry events.
- Alert on countdown desynchronization between backend and UI (difference > 5 s).
- Capture user complaints via analytics funnel and correlate with release timestamp.

## 6. Communication Plan

- **T-5 Days**: Notify stakeholders during weekly review; share readiness status.
- **T-1 Day**: QA signs off final regression, release notes drafted.
- **Go-Live**: Announce in #scheduling-ui Slack channel; include quickstart instructions with new env flag.
- **Post-Go-Live**: 48-hour watch window with hourly check-ins; summarize in `CHANGELOG.md`.

## 7. Open Follow-Ups

- Automate contract parity check (script placeholder above).
- Define production telemetry sinks for countdown accuracy alerts.
- Document backend retry/backoff strategy for manager approvals.
