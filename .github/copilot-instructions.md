# GitHub Copilot Instructions: Appointment Management Web Application

## Project Overview

This is a web application for small businesses to manage appointments with a request-approval workflow.

## Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript 5, TailwindCSS 4, shadcn 3, TanStack Router 1, React Hook Form 7, Zustand 5, TanStack Query 5, date-fns 4
- **Backend**: Node.js 22, Express.js 5, TypeScript 5, Drizzle 0, PostgreSQL 16, better-auth 1, oRPC 1, Zod 4
- **Database**: Drizzle ORM with PostgreSQL (prod) / SQLite (dev)
- **Testing**: Vitest 3, React Testing Library 16, supertest 7, MSW 2
- **Shared**: oRPC 1, Zod 4, zod-openapi 5, dotenv 17, ESLint 9, Prettier 3, Husky 9, lint-staged 16

## Architecture

- Monorepo structure with packages/frontend, packages/backend, and packages/shared
- End-to-end type-safe API communication with oRPC
- Type-safe database operations with Drizzle ORM
- Modern authentication with better-auth
- Efficient state management with Zustand + TanStack Query
- Zod schemas for runtime validation
- OpenAPI spec generation with zod-openapi
- Code quality with ESLint, Prettier, Husky, and lint-staged

## Key Features

- User registration and authentication
- Appointment request creation
- Manager approval/rejection workflow
- Service management
- Time slot availability checking

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use descriptive variable and function names
- Add JSDoc comments for complex functions

### API Design

- Use oRPC for end-to-end type-safe API communication
- Define procedures with Zod schemas for input/output validation
- Implement proper error handling with meaningful messages
- Use Drizzle ORM for type-safe database operations
- Follow RESTful conventions where applicable

### Database

- Use Drizzle ORM for all database operations
- Define schemas with proper relationships and constraints
- Use transactions for complex operations
- Implement proper indexing for performance

### Authentication

- Use better-auth for authentication flows
- Implement role-based access control (customer, manager)
- Secure API endpoints with proper authorization
- Handle JWT tokens securely

### State Management

- Use Zustand for client-side state management
- Use TanStack Query for server state synchronization
- Implement proper loading and error states
- Cache data appropriately to reduce API calls

### Forms

- Use React Hook Form for form handling
- Integrate with Zod for form validation
- Implement proper error messages and user feedback
- Handle form submission with loading states
- Implement rate limiting
- Sanitize user inputs
- Use HTTPS in production

## File Structure

```
packages/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/          # Zustand stores
│   │   └── lib/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/          # Drizzle schemas
│   │   ├── middleware/
│   │   ├── procedures/      # oRPC procedures
│   │   └── utils/
│   ├── drizzle/             # Database migrations
│   └── dist/
└── shared/
    ├── src/
    │   ├── schemas/         # Zod schemas
    │   └── types/
    └── dist/
```

## Common Patterns

### Component Creation

```tsx
interface Props {
  // props
}

export function ComponentName({ prop }: Props) {
  return <div>{/* JSX */}</div>;
}
```

### oRPC Procedure

```ts
import { z } from 'zod';
import { procedure } from '../orpc';

const inputSchema = z.object({
  // input validation
});

export const exampleProcedure = procedure
  .input(inputSchema)
  .output(
    z.object({
      /* output schema */
    })
  )
  .handler(async ({ input }) => {
    // implementation
    return result;
  });
```

### Drizzle Database Query

```ts
import { db } from '../db';
import { users } from '../schema';

export async function getUser(id: string) {
  return db.select().from(users).where(eq(users.id, id)).limit(1);
}
```

### Zustand Store

```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    set => ({
      user: null,
      setUser: user => set({ user }),
    }),
    { name: 'app-store' }
  )
);
```

### React Hook Form with Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* form fields */}</form>;
}
```

## Best Practices

- Keep components small and focused
- Use custom hooks for shared logic
- Implement proper loading and error states
- Follow accessibility guidelines
- Optimize bundle size
- Use environment variables for configuration

## Git Workflow

- Use feature branches
- Write clear commit messages
- Create pull requests for review
- Run tests before pushing
- Keep commits atomic

## Performance Tips

### Frontend

- Always respect React Hooks rules, so that the new React's Compiler optimizations can be fully utilized.
- Implement lazy loading for routes
- Use Suspense for data fetching
- Code-split components using dynamic imports where appropriate
- Utilize useTransition and concurrent features
- Optimize images and assets

### Backend

- Use database indexes
- (Future) Implement caching where appropriate
