# Tech Stack

1. Note Dependencies versions are indicated with `^` followed by the major version number.
2. Dependencies that are not explicitly versioned mean that their version is in the Shared category.

## Frontend

- Bundler: Vite (^7)
- Framework: React (^19)
- Routing: TanStack Router (^1)
- Styling: TailwindCSS (^4)
- UI Components Lib: shadcn (^3)
- End-to-end typesafe API: oRPC
- Testing: Vitest, React Testing Library(^16) and msw
- Forms: React Hook Form (^7)
- State Management: Zustand (^5) + TanStack Query (^5)
- Validation: Zod
- Date Handling: date-fns (^4)

## Backend

- Runtime: Node.js (^22)
- Framework: Express (^5)
- Database: Drizzle (^0) + PostgreSQL (^16)
- Authentication: better-auth (^1)
- End-to-end typesafe API: oRPC
- Validation: Zod
- Testing: Vitest and supertest (^7)

## Shared

- Typescript (^5)
- oRPC (^1)
- Validation: Zod (^4)
- Environment Variables: dotenv (^17)
- Linting: ESLint (^9)
- Formatting: Prettier (^3)
- Git Hooks: Husky (^9)
- Commit: lint-staged (^16)
- Testing: Vitest (^3)
