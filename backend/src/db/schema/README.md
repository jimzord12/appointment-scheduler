# Drizzle Schema Directory

Place table schema definition files here (e.g., `users.ts`, `services.ts`, `appointmentRequests.ts`, `appointments.ts`).

Each schema file should:

- Export table definitions using Drizzle ORM helpers
- Export associated TypeScript types (e.g., `export type User = typeof users.$inferSelect`)
- Avoid business logic; keep pure data shape + relations

Migration generation will scan this directory.
