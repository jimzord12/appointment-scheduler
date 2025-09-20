# Quickstart: Appointment Management Web Application

This guide helps you run the monorepo locally on Windows (PowerShell) or any POSIX shell. It reflects the current repository layout and scripts.

## Prerequisites

- Node.js 22 (latest LTS recommended)
- pnpm (preferred) or npm
- Git
- PostgreSQL 16 (only required if you enable DB-backed repositories)

## 1) Clone and install

```pwsh
git clone <repository-url>
cd appointment-scheduler
pnpm install
```

## 2) Configure backend environment

The backend keeps its env file in `backend/`.

```pwsh
# Copy example env (PowerShell)
Copy-Item backend/.env.example backend/.env

# Then open backend/.env and adjust values as needed
# Minimum for dev:
# - Leave JWT_SECRET as the dev default (change for production)
# - You can keep USE_DB_* = 0 to run without Postgres
```

Key variables (from `backend/.env.example`):

- `PORT` (default `3000`)
- `JWT_SECRET` (must be a strong secret in production)
- `ALLOWED_ORIGINS` (comma-separated; used only when `NODE_ENV=production`)
- `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_MINUTES` or `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`
- `DATABASE_URL` (Postgres connection string; only needed when enabling DB repos)
- `USE_DB_APPOINTMENTS`, `USE_DB_SERVICES`, `USE_DB_USERS` (feature toggles)

## 3) Optional: enable DB-backed repositories

By default, services use in-memory stores so you can run without Postgres. To use Postgres/Drizzle, set toggles and run migrations:

```pwsh
# backend/.env
DATABASE_URL=postgres://user:password@localhost:5432/appointments
USE_DB_APPOINTMENTS=1
USE_DB_SERVICES=1
USE_DB_USERS=1

# Generate and run migrations
pnpm -C backend db:generate
pnpm -C backend db:migrate
```

## 4) Run in development

Start both servers from the repo root:

```pwsh
pnpm dev
```

Or run individually:

```pwsh
pnpm dev:backend   # API at http://localhost:3000
pnpm dev:frontend  # Web at http://localhost:5173
```

## 5) API documentation

Once the backend is running:

- OpenAPI JSON: `http://localhost:3000/docs/openapi.json`
- Health check: `http://localhost:3000/health`

## 6) Testing

Run all tests from the root:

```pwsh
pnpm test
```

Or per package:

```pwsh
pnpm -C backend test
pnpm -C frontend test
```

End-to-end (optional):

```pwsh
pnpm -C frontend exec playwright install
pnpm test:e2e
```

For a quick DB connectivity smoke test:

```pwsh
pnpm -C backend run test:db
```

## 7) Rate limiting, JWT, and CORS (production)

- Rate limiting is enabled by default outside test unless you disable it; override with env vars in `backend/.env`.
- In production (`NODE_ENV=production`), the server requires a strong `JWT_SECRET` and restricts CORS to `ALLOWED_ORIGINS`.

## Notes

- There are no seeded default users by default. Use the app or call `/auth/register` to create accounts during development.
- A production build pipeline will be wired in follow-up tasks (see CI task group). For development, `pnpm dev` is sufficient.

## Troubleshooting

1. Port already in use

- Change `PORT` in `backend/.env` or stop the conflicting process.

2. Database connection failed (when DB repos are enabled)

- Verify `DATABASE_URL` and that Postgres is running.
- Run migrations: `pnpm -C backend db:migrate`.

3. Build or type errors

- Clear modules and reinstall: `Remove-Item -Recurse -Force node_modules; pnpm install` (PowerShell)
- Check Node version: `node --version`

## Development workflow

1. Create a branch: `git checkout -b feature/xyz`
2. Make changes and add tests
3. Run tests: `pnpm test`
4. Commit: `git commit -m "feat: xyz"`
5. Push: `git push origin feature/xyz`
6. Open a PR
