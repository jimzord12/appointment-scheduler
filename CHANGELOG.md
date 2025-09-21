# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-09-21

- Initial feature-complete release for Appointment Management Web Application
- Backend: Express 5 API with authentication, services, and appointment request workflow; Drizzle ORM schemas; rate limiting; structured logging; OpenAPI generation
- Frontend: React 19 app with routing, auth, services management, and appointment flows; MSW-backed tests
- Shared: Zod schemas and contract alignment for transport types
- CI: Lint, typecheck, tests, and OpenAPI artifact upload

Artifacts:

- OpenAPI: `backend/openapi.json`

Notes:

- JWT/CORS hardened for production; dev-friendly defaults documented in `specs/001-build-an-web/quickstart.md`
