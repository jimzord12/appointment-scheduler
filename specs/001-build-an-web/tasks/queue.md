---
description: Active execution queue — current, next, and recent tasks for 001-build-an-web.
---

# Execution Queue — 001-build-an-web

## Now (in progress)

- T085 Implement authentication pages (RHF + Zod)
- T091 Update and stabilize contract tests for final transport types

## Up Next (respect dependencies)

- T077 Wire Drizzle DB for appointments (depends on T076)
- T083 Migrate User/Service services to DB (phase 1)
- T089 Routing with TanStack Router and protected routes (depends on T085)
- T082 Generate OpenAPI from Zod contracts (after contracts stable)

## Later

- T086 Services list and create (manager-only UI)
- T087 Appointment request form and list
- T088 Manager approval workflow UI
- T092 E2E happy path (MSW off)
- T093 Quickstart and backend README updates
- T094 CI pipeline: lint, typecheck, test, OpenAPI artifact
- T095 Seed and local dev database automation

## Recently Completed (highlights)

- T060–T063 Review follow-ups: transport types, schema dedupe, 409 on double-booking
- T076 Remove duplicate Drizzle schema for appointment requests
- T078 Rate limiting with env controls
- T079 Enforce JWT secret in production
- T080 Restrict CORS in production
- T081 Request ID correlation logging
- T084 Lazy DB initialization for tests
