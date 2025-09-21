# Backend (Express + TypeScript)

[![CI](https://github.com/jimzord12/appointment-scheduler/actions/workflows/ci.yml/badge.svg)](https://github.com/jimzord12/appointment-scheduler/actions/workflows/ci.yml)

API server for the Appointment Scheduler.

## Scripts

Run from repo root using pnpm workspace filters, or inside `backend/`.

- `pnpm -C backend dev` 680 Start dev server (http://localhost:3000)
- `pnpm -C backend test` 9ea Run tests (Vitest)
- `pnpm -C backend typecheck` TypeScript typecheck
- `pnpm -C backend lint` / `lint:fix` Lint code
- `pnpm -C backend db:generate` Generate Drizzle migrations
- `pnpm -C backend db:migrate` Apply migrations
- `pnpm -C backend db:push` Push schema (use cautiously)
- `pnpm -C backend db:seed` Seed demo data (manager user + sample services)

## Environment

Copy `backend/.env.example` to `backend/.env` and adjust.

Key variables:

- `PORT` (default `3000`)
- `JWT_SECRET` (required in production; dev default acceptable for local dev)
- `ALLOWED_ORIGINS` (comma-separated; applied when `NODE_ENV=production`)
- `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_MS` or `RATE_LIMIT_WINDOW_MINUTES`, `RATE_LIMIT_MAX`
- `DATABASE_URL` (Postgres; required when enabling DB repos)
- `USE_DB_APPOINTMENTS`, `USE_DB_SERVICES`, `USE_DB_USERS` (feature toggles)

## API

Routers are mounted at root:

- `POST /auth/register`
- `POST /auth/login`
- `GET /user/profile` (auth)
- `PATCH /user/profile` (auth)
- `GET /services` (auth)
- `POST /services` (manager)
- `GET /appointments/requests` (auth)
- `POST /appointments/requests` (auth)
- `PATCH /appointments/requests/{id}` (manager)
- `GET /health` (no auth)
- Docs: `GET /docs/openapi.json`

OpenAPI is generated from Zod contracts (`src/openapi.ts`).

## Authentication & Authorization

- Authentication uses JWT in the `Authorization` header with the Bearer scheme:
  - `Authorization: Bearer <jwt>`
- Roles: `customer` and `manager`.
  - Endpoints requiring manager privileges are annotated below.
- Token claims expected: `sub` (user id) and `role`.
  - Missing/invalid tokens result in `401 { "error": "unauthorized" }`.
  - Non-manager on manager-only routes results in `403 { "error": "forbidden" }`.

## Headers & Conventions

- `Content-Type: application/json` and `Accept: application/json` for JSON endpoints.
- Optional correlation header: `X-Request-Id`. When provided, it’s echoed in logs for traceability.
- Responses are JSON; error responses follow a consistent shape (see Error model).

## Error model

- Unauthorized: `401 { "error": "unauthorized" }`
- Forbidden: `403 { "error": "forbidden" }`
- Rate limited: `429 { "error": "rate_limit" }`
- Validation failure (Zod): `400 { "error": "Validation failed", "issues": [...] }`
- Other errors: `5xx { "error": "<message>", "stack": "..." }` (stack omitted in production)

## Correlation & Logging

- JSON structured logs include fields like `timestamp`, `level`, `message`, `method`, `url`, `statusCode`, `responseTime`, and `requestId`.
- You can send `X-Request-Id` to correlate your client logs with server logs; otherwise the server generates an id (e.g., `req_ab12cd34`).
- Default log level is `info`; debug logging can be enabled by changing the logging middleware configuration in code.

## OpenAPI docs & generation

- Live spec: `GET /docs/openapi.json`
- Generate file locally:

```pwsh
pnpm -C backend openapi:generate
```

This writes `backend/openapi.json` using the Zod contracts.

## Curl examples

Register:

```pwsh
curl -s -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

Login:

```pwsh
curl -s -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d '{"email":"alice@example.com","password":"password123"}'
```

Get profile (requires token):

```pwsh
curl -s http://localhost:3000/user/profile ^
  -H "Authorization: Bearer <jwt>"
```

List services (requires token):

```pwsh
curl -s http://localhost:3000/services ^
  -H "Authorization: Bearer <jwt>"
```

Create service (manager only):

```pwsh
curl -s -X POST http://localhost:3000/services ^
  -H "Authorization: Bearer <jwt>" ^
  -H "Content-Type: application/json" ^
  -d '{"name":"Haircut","durationMinutes":30}'
```

Create appointment request (requires token):

```pwsh
curl -s -X POST http://localhost:3000/appointments/requests ^
  -H "Authorization: Bearer <jwt>" ^
  -H "Content-Type: application/json" ^
  -d '{"serviceId":"<uuid>","requestedDate":"2030-01-01","requestedTime":"10:00"}'
```

Approve appointment request (manager only):

```pwsh
curl -s -X PATCH http://localhost:3000/appointments/requests/<id> ^
  -H "Authorization: Bearer <jwt>" ^
  -H "Content-Type: application/json" ^
  -d '{"status":"approved"}'
```

## Running with Postgres (optional)

1. Set env toggles and connection string in `backend/.env`:

```
DATABASE_URL=postgres://user:password@localhost:5432/appointments
USE_DB_APPOINTMENTS=1
USE_DB_SERVICES=1
USE_DB_USERS=1
```

2. Run migrations:

```
pnpm -C backend db:generate
pnpm -C backend db:migrate
```

3. (Optional) Seed demo data:

```
pnpm -C backend db:seed
```

4. Start the server:

```
pnpm -C backend dev
```

## Security notes

- Rate limiting
  - Enable/disable: `RATE_LIMIT_ENABLED` accepts `1`/`true` to enable, `0`/`false` to disable. If unset, it defaults to enabled except during tests (`VITEST` env).
  - Window: `RATE_LIMIT_WINDOW_MS` (priority) or `RATE_LIMIT_WINDOW_MINUTES` (default `15`).
  - Max: `RATE_LIMIT_MAX` per window (default `100`).
  - Response shape on exceed: HTTP 429 with `{ "error": "rate_limit" }`.
  - Dev tip: `.env.example` ships with `RATE_LIMIT_ENABLED=0` to avoid throttling in local dev.
- In production, a strong `JWT_SECRET` is required and CORS is restricted to `ALLOWED_ORIGINS`.

## Tests

- Run all backend tests: `pnpm -C backend test`
- DB smoke test only: `pnpm -C backend run test:db`
