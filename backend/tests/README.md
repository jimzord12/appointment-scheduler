# DB-backed integration tests

This folder contains integration tests that can run against a real Postgres database using Testcontainers.

Requirements:

- Docker running locally
- pnpm installed

Run only the DB-backed test:

```
pnpm -C backend run test:db
```

Troubleshooting:

- If you cannot run Docker, set `SKIP_DB_TESTS=1` to skip these tests temporarily.
- Migrations are applied via `pnpm db:push` using `DATABASE_URL` from the started container.
