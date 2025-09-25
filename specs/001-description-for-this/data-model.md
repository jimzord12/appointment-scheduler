# Data Model – Complete UI polish for appointment scheduling app

This document reflects the data contracts our frontend will consume via MSW while staying compatible with the future backend. All entities reference existing or planned schemas in `shared/contracts` to honor the Modern Typed Stack Discipline (P4).

## Appointment

- **Identifier**: `id` (UUID string)
- **Primary Fields**:
  - `customerId` (UUID) – links to UserProfile customer persona
  - `serviceId` (UUID) – references Service
  - `scheduledStart` (ISO timestamp)
  - `scheduledEnd` (ISO timestamp)
  - `status` (enum: `pending`, `approved`, `rejected`, `completed`, `cancelled`)
  - `countdownSeconds` (number) – derived from `scheduledStart`, 0 when status ≠ `approved`
  - `notes` (string | null)
  - `createdAt` / `updatedAt` (ISO timestamp)
- **Relationships**: One user can have at most one appointment with status `approved` or `pending` (P1). Manager decisions transition status via ManagerDecision entity.
- **Validation Rules**:
  - `scheduledEnd` must be after `scheduledStart`
  - `notes` limited to 500 characters
  - `status` transitions follow `pending → approved/rejected`, `approved → completed/cancelled`

## ManagerDecision

- **Identifier**: composite (`appointmentId`, `decisionTimestamp`)
- **Fields**:
  - `appointmentId` (UUID) – foreign key to Appointment
  - `managerId` (UUID) – references UserProfile with role `manager`
  - `decision` (enum: `approved`, `rejected`)
  - `comment` (string | null, max 300 chars)
  - `decisionTimestamp` (ISO timestamp)
- **Purpose**: Tracks approval workflow required by P2, enabling audit trails and customer notifications.

## Service

- **Identifier**: `id` (UUID)
- **Fields**:
  - `name` (string)
  - `description` (string | null)
  - `durationMinutes` (integer ≥ 15)
  - `priceCents` (integer ≥ 0)
  - `category` (enum: `hair`, `nails`, `spa`, `other`)
  - `active` (boolean)
- **Relationships**: Referenced by Appointment; categories grouped for filtering within pages.

## UserProfile

- **Identifier**: `id` (UUID)
- **Fields**:
  - `role` (enum: `customer`, `stylist`, `manager`)
  - `displayName` (string)
  - `email` (string, RFC 5322)
  - `phone` (E.164 string | null)
  - `preferredLocale` (enum: `en-US`, `el-GR`)
  - `timeZone` (IANA name)
  - `hasActiveAppointment` (boolean) – derived from Appointment status
  - `notificationPreferences` (object: `email`, `sms`, `push` booleans)
- **Constraints**: `manager` role flagged for approval interfaces; `hasActiveAppointment` governs calendar CTA visibility (P1/P3).

## ThemeTokenSet

- **Identifier**: `version` (string semver, e.g., `darkmatter-1.0.0`)
- **Fields**:
  - `colors` (object) – primary, secondary, accent, success, warning, surface values
  - `typography` (object) – font families, weights, letter spacing per scale
  - `radius` (object) – border radii tokens
  - `spacing` (object) – spacing scale values
  - `shadow` (object) – elevation presets
  - `motion` (object) – durations for transitions with reduced-motion overrides
- **Usage**: Imported into Tailwind config and Shadcn `cn` helpers; theme updates propagate automatically across pages.

## PageInteraction

- **Identifier**: `slug` (string, matches route)
- **Fields**:
  - `primaryAction` (string) – canonical CTA as defined in the UI PRD
  - `supportingActions` (string[])
  - `personas` (array of `customer`, `stylist`, `manager`)
  - `successCriteria` (array of measurable outcomes, e.g., "booking submitted < 60s")
  - `telemetryEvents` (string[]) – instrumentation events to emit for P5
- **Relationships**: References data entities needed per page (e.g., appointments list page requires Appointment + Service).
- **Notes**: Derived from the co-created PRD; kept in sync via a single source JSON file consumed by page components.
