# Data Model: Appointment Management Web Application

## Overview

The application manages appointments for small businesses with a request-approval workflow.

## Entities

### User

Represents system users (customers and managers).

**Attributes:**

- `id`: UUID (primary key)
- `name`: String (required, 2-100 characters)
- `email`: String (required, unique, valid email format)
- `password_hash`: String (required, bcrypt hash)
- `role`: Enum (customer, manager) (required)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

**Relationships:**

- Has many Appointment Requests (as customer)
- Can approve/reject Appointment Requests (as manager)

### Service

Represents available services offered by the business.

**Attributes:**

- `id`: UUID (primary key)
- `name`: String (required, 2-50 characters)
- `description`: String (optional, up to 500 characters)
- `duration_minutes`: Integer (required, 15-480 minutes)
- `price`: Decimal (required, >= 0)
- `is_active`: Boolean (default true)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

**Relationships:**

- Has many Appointment Requests

### Appointment Request

Represents a customer's request for an appointment.

**Attributes:**

- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to User)
- `service_id`: UUID (foreign key to Service)
- `requested_date`: Date (required)
- `requested_time`: Time (required)
- `status`: Enum (pending, approved, rejected) (default pending)
- `notes`: String (optional, up to 1000 characters)
- `manager_notes`: String (optional, for manager comments)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

**Relationships:**

- Belongs to User
- Belongs to Service
- Has one Appointment (when approved)

**Business Rules:**

- Cannot have overlapping approved appointments for same time slot
- Status transitions: pending → approved/rejected
- Only managers can change status

### Appointment

Represents a confirmed appointment.

**Attributes:**

- `id`: UUID (primary key)
- `request_id`: UUID (foreign key to Appointment Request, unique)
- `confirmed_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

**Relationships:**

- Belongs to Appointment Request

## Database Schema

Using Drizzle ORM for type-safe database operations with PostgreSQL for production and SQLite for development.

**Tables (Drizzle Schema):**

- `users` - User accounts and authentication
- `services` - Available services with pricing
- `appointment_requests` - Customer appointment requests
- `appointments` - Confirmed appointments

**Indexes:**

- `users.email` (unique)
- `appointment_requests.user_id`
- `appointment_requests.service_id`
- `appointment_requests.requested_date`
- `appointment_requests.status`
- `appointments.request_id` (unique)

**Drizzle Features:**

- Type-safe queries and mutations
- Automatic migration generation
- Schema validation at compile time
- Support for both PostgreSQL and SQLite

## Validation Rules

- Email format validation
- Password strength requirements
- Date/time constraints (business hours, future dates only)
- Service duration limits
- Price range validation

## Data Flow

1. User registers → User created
2. Manager creates services → Services available
3. Customer requests appointment → Appointment Request created
4. Manager approves/rejects → Status updated, Appointment created if approved
5. System prevents double-booking

## Security Considerations

- Password hashing with bcrypt
- JWT tokens for authentication
- Role-based access control
- Input sanitization
- Rate limiting on API endpoints
