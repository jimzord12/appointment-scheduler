This is Web Application for a Hair Salon Appointment Booking System.

## Main features

### Customer Features

- User Registration and Authentication with email and password.
- Allow customer to book, view, update, and cancel appointments. Customers can have **ONLY one active appointment at a time**.
- Provide a user-friendly interface for managing appointments.
  - When the customer has booked an appointment, they can see the details of the appointment and have options to update or cancel it. Additionally, a nice looking Countdown Timer should be displayed, showing the time remaining until the appointment.
  - When the customer does not have any active appointment, a beautiful intuitive Calendar UI Component should be displayed. This Component is the heart of the application. Therefore, it should be designed with great care and attention to detail. It should be visually appealing and easy to use. The customer needs a way to quickly see available time slots and book an appointment with just a few clicks.
- Before completing the booking, the customer should be able to see a summary of their appointment details, including the date, time, and service selected.
- Always ask for confirmation before booking, updating, or canceling an appointment.
- Show a confirmation message after successfully booking, updating, or canceling an appointment.
- Allow customer to receive notifications and reminders about their appointments.
-

### Manager Features

- Managers have access to a separate page, the Dashboard.
- Managers can view and manage all appointments and customers.
- Managers can also view all customers and their details.

### Features **IMPORTANT** Notes

- There is only one Admin user in the system. The Admin user is created manually in the database.
- Managers can ONLY be created by the Admin user.
- When a customer requests to book an appointment, of course the backend needs to check if the requested time slot is available. However, the appointment is set to "pending" status first. A Manager needs to approve the appointment before it becomes "confirmed". Ideally, a notification should be sent to the Manager when a new appointment is requested. However, for simplicity, the Manager can see all "pending" appointments in the Dashboard and approve or reject them. Also, when the managers approve or reject an appointment, a notification should be sent to the customer.

## Technology Stack

This is monorepo project using pnpm as package manager.

### Frontend

This is a SPA Website using Typescript v5+, Vite v7+ and React v19+.
Additionally, the following libraries and tools are used:

- TanStack Router for React v1+ is used for routing.
- TanStack React Query v5+ is used for data fetching and state management.
- Zustand v5+ is used for global state management.
- React Hook Form v7+ is used for form handling and validation.
- Tailwind CSS v4+ is used for styling and layout.
- Zod v4+ is used for schema validation.

The Technology Stack is quite new and modern. Therefore, it is important to use the latest versions of the libraries and tools.
You should utilize the MCP Server tools to obtain up-to-date information about the latest versions of these libraries and tools.

#### Frontend - Testing

- Vitest is used for unit and integration testing.
- React Testing Library is used for testing React components.
- Playwright is used for end-to-end testing.
- Axe-core is used for accessibility testing.
- MSW (Mock Service Worker) is used for API mocking.

### Backend

The backend is built using Node.js v20+ Typescript v5+ and Express v5+.
Additionally, the following libraries and tools are used:

- Drizzle ORM v0.30+ is used for database interactions.
- Zod v4+ is used for schema validation.
- pg (node-postgres) v8+ is used for PostgreSQL 16 database interactions.
- bcryptjs v3+ is used for password hashing.
- better-auth v1+ is used for authentication and authorization. (Note: Use the Better Auth MCP Server for integration.) Also, better-auth can integrate well with drizzle using their `better-auth/adapters/drizzle` adapter.
- zod v4+ is used for schema validation.
- zod-openapi v5+ is used for OpenAPI schema generation.
- express-rate-limit v7+ is used for rate limiting.

#### Backend - Testing

- Vitest is used for unit and integration testing.
- Supertest is used for testing HTTP endpoints.
- testcontainers v10+ is used for integration testing with PostgreSQL database.
