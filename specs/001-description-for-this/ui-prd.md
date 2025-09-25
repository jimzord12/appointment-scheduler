# Scheduling UI PRD

**Feature**: Complete UI polish for appointment scheduling app  
**Source**: Exported from Notion on 2025-09-26  
**Stakeholders**: Product (Ana K.), Design (Leo M.), Engineering (Frontend: Priya S., Backend: Evan J.), QA (Niamh T.)

## Product North Star

Deliver a mock-driven, production-ready experience that enables coordinators, stylists, and managers to validate every end-to-end scheduling flow while the backend API matures. Success is measured by:

- 10/10 pages demonstrating Darkmatter-themed visuals, consistent navigation, and accessible interactions.
- Stakeholder sign-off across three weekly review cycles captured in the feedback log.
- Performance benchmarks: page navigation < 500 ms, theme toggle feedback < 100 ms, mock responses < 50 ms.
- Zero violations of the one-appointment policy or manager approval lifecycle during UAT.

## Personas

| Persona         | Goals                                             | Pain Points                                                 | Guardrails                                                        |
| --------------- | ------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| **Customer**    | Book and manage personal appointments seamlessly. | Confusing navigation, slow feedback, unclear status.        | Enforce single active appointment, countdown clarity (P1).        |
| **Stylist**     | Review upcoming schedule and prepare services.    | Missing context on services, inconsistent UI cues.          | Provide accurate service metadata, accessible calendar view (P3). |
| **Manager**     | Approve or reject bookings, monitor KPIs.         | Limited visibility into pending decisions, noisy telemetry. | Dedicated approval queue, notification visibility (P2).           |
| **Coordinator** | Demo full product to stakeholders.                | Backend downtime, fragmented design tokens.                 | MSW parity with backend contracts, centralized tokens (P4/P5).    |

## Page Index

| Page                                                     | Primary Persona(s)    | Goal                                                         | Primary Action                                             | Success KPIs                                                   | Constitutional Guardrails                                                                      |
| -------------------------------------------------------- | --------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Home (`frontend/src/pages/Home.tsx`)**                 | Customer, Coordinator | Showcase brand story and route users into scheduling flows.  | Click "Book Now" CTA.                                      | CTA click-through ≥ 65%, bounce < 20%.                         | Ensure hero respects reduced motion (P3).                                                      |
| **Dashboard (`.../Dashboard.tsx`)**                      | Customer              | Provide snapshot of next appointment, countdown, and alerts. | Acknowledge manager decisions or view appointment details. | Daily active users viewing countdown ≥ 75%.                    | Countdown blocks double booking (P1); decision badges reflect manager status (P2).             |
| **Appointments (`.../Appointments.tsx`)**                | Customer              | Manage current and past bookings via calendar-first view.    | Select a day, open appointment detail drawer.              | Calendar interaction success ≥ 90%.                            | Calendar is top-of-page, keyboard accessible (P3).                                             |
| **Manager Appointments (`.../ManagerAppointments.tsx`)** | Manager               | Triage pending requests and action approvals.                | Approve/Reject a pending appointment.                      | Decision latency median < 2 min (mock).                        | Pending is default state; notifications mirrored (P2).                                         |
| **Book Appointment (`.../BookAppointment.tsx`)**         | Customer              | Create a new appointment with confidence.                    | Submit booking form.                                       | Form completion rate ≥ 70%, validation errors resolved < 30 s. | Prevent booking when countdown active (P1); form uses Shadcn validation patterns (P4).         |
| **Services (`.../Services.tsx`)**                        | Customer, Stylist     | Explore available services grouped by category.              | Filter services or start booking.                          | Filter usage ≥ 50%, service detail click ≥ 40%.                | Service data reflects shared contracts (P4/P5).                                                |
| **Service Details (`.../ServiceDetails.tsx`)**           | Customer              | Understand service specifics before booking.                 | Click "Book" from detail.                                  | Detail-to-book conversion ≥ 45%.                               | Motion-safe transitions (P3); respect one-appointment constraints (P1).                        |
| **Profile (`.../Profile.tsx`)**                          | Customer              | Manage locale, notification preferences, motion settings.    | Save profile updates.                                      | Save success rate ≥ 95%, locale switch < 3 clicks.             | Notification toggles align with manager decisions (P2); reduced-motion preference stored (P3). |
| **Login (`.../Login.tsx`)**                              | Customer, Manager     | Authenticate into the mock environment.                      | Submit credentials form.                                   | Error-free login completion ≥ 98%.                             | Error messaging accessible (P3), telemetry tracked (P5).                                       |
| **Register (`.../Register.tsx`)**                        | Customer              | Create mock account aligned with personas.                   | Submit registration form.                                  | Completion ≥ 85%, time to complete < 90 s.                     | Roles limited to allowed personas; countdown guidance presented post-register (P1/P2).         |

## Interaction Scripts

1. **Happy Path (Customer)**
   - Landing on Home → CTA to Book Appointment → pick service → choose slot in calendar → review countdown on Dashboard.
   - Verify MSW returns countdown and manager status stub; ensure telemetry events logged.
2. **Manager Review**
   - Login as manager → Manager Appointments queue → approve/reject pending items → confirm customer notification banner surfaces on Dashboard mock.
3. **Accessibility Sweep**
   - Keyboard-only navigation across calendar → confirm focus indicators, ARIA labels.
   - Toggle reduced motion preference; ensure animations disable while theme styling persists.
4. **Localization**
   - Switch locale in Profile → revisit Home, Dashboard, Manager pages → copy must remain translated and pass Darkmatter contrast ratios.

## Acceptance Checklist

- [ ] Calendar-first layout verified on all scheduling pages (Home, Appointments, Book, Dashboard).
- [ ] Countdown timers prevent double booking and show manager status when applicable.
- [ ] Darkmatter theme tokens render consistently across Shadcn components.
- [ ] MSW data seeded with deterministic Faker fixtures (seed 20250925).
- [ ] Performance benchmarks recorded (navigation, theme toggle, MSW latency).
- [ ] Stakeholder feedback log updated after each review cycle (weekly cadence).
- [ ] Mock-to-live playbook rehearsed before backend integration milestone.

## Review Cadence

- Weekly stakeholder review (Fridays, 10:00 AM PST) focusing on two pages per session.
- QA regression using Playwright suite after each major UI polish batch.
- Performance sample run captured at least once per sprint and attached to feedback log.

## Open Questions

- How should we surface backend readiness status once APIs become available? (Track in playbook.)
- Do we need an additional "Reports" page in the future? (Out of current scope, note for backlog.)
