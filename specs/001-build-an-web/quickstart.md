# Quickstart: Appointment Management Web Application

## Prerequisites

- Node.js 22 (latest LTS recommended)
- PostgreSQL 16 (for production database)
- npm or yarn or pnpm
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd appointment-scheduler
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
# Required: DATABASE_URL, BETTER_AUTH_SECRET, etc.
```

4. Set up the database:

```bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

## Development Setup

### Monorepo Structure

This project uses a monorepo structure with shared packages:

- `packages/frontend` - React application
- `packages/backend` - Express.js API server
- `packages/shared` - Common types and utilities

### Backend Setup

1. The backend is already configured in the monorepo root
2. Database migrations are run from the root:

```bash
# Generate TypeScript types from database schema
npm run db:generate

# Run database migrations
npm run db:migrate

# Push schema changes to database
npm run db:push
```

3. Start the backend development server:

```bash
npm run dev:backend
```

The backend will be available at `http://localhost:3001`

4. Optional: Enable DB-backed repositories (appointments, services, users)

- By default, appointment requests use an in-memory store so you can run tests without Postgres.
- To exercise the Postgres/Drizzle path for appointment requests, set the env toggle and ensure your DB is ready:

```bash
# .env (backend)
DATABASE_URL=postgres://user:password@localhost:5432/appointments
USE_DB_APPOINTMENTS=1
USE_DB_SERVICES=1
USE_DB_USERS=1
```

Then run migrations:

```bash
pnpm -C backend db:generate
pnpm -C backend db:migrate
```

Now starting the server or running tests will use the DB for appointment requests.

5. Rate limiting configuration

- The backend includes `express-rate-limit` with sane defaults.
- Defaults (in non-test env): `RATE_LIMIT_WINDOW_MINUTES=15`, `RATE_LIMIT_MAX=100`.
- You can override with:

```bash
# .env (backend)
RATE_LIMIT_ENABLED=1        # force-enable in tests or disable with 0 in dev
RATE_LIMIT_WINDOW_MS=60000  # or set RATE_LIMIT_WINDOW_MINUTES=1
RATE_LIMIT_MAX=60
```

When the limit is exceeded, the API responds with HTTP 429 and body `{ "error": "rate_limit" }`.

6. JWT secret and CORS in production

- In production (`NODE_ENV=production`), the app will fail fast unless `JWT_SECRET` is set to a non-default strong value.
- CORS is permissive in dev/test. In production, set `ALLOWED_ORIGINS` (comma-separated) to explicitly allow origins:

```bash
# .env (backend)
NODE_ENV=production
JWT_SECRET=your-strong-secret
ALLOWED_ORIGINS=https://admin.example.com,https://app.example.com
```

### Frontend Setup

1. The frontend is configured in the monorepo
2. Start the frontend development server:

```bash
npm run dev:frontend
```

The frontend will be available at `http://localhost:5173`

## Building for Production

### Backend

```bash
cd packages/backend
npm run build
npm start
```

### Frontend

```bash
cd packages/frontend
npm run build
```

## Testing

### Backend

```bash
cd packages/backend
npm test
```

### Frontend

```bash
cd packages/frontend
npm test
```

## API Documentation

Once the backend is running, visit:

- OpenAPI spec: `http://localhost:3001/docs`
- API endpoints: `http://localhost:3001/api`

## Default Users

After setup, the following users are available:

- Manager: manager@example.com / password123
- Customer: customer@example.com / password123

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in .env file
   - Kill processes using the ports

2. **Database connection failed**
   - Check DATABASE_URL in .env
   - Ensure database is running
   - Run migrations: `npm run db:migrate`

3. **Build failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

### Logs

- Backend logs: Check console output or logs/ directory
- Frontend logs: Browser developer tools console

## Development Workflow

1. Create feature branch: `git checkout -b feature/xyz`
2. Make changes
3. Run tests: `npm test`
4. Commit: `git commit -m "feat: add xyz"`
5. Push: `git push origin feature/xyz`
6. Create pull request

## Contributing

See CONTRIBUTING.md for detailed guidelines.
