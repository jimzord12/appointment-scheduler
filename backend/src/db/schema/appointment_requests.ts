import { index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { services } from './services.js';
import { users } from './users.js';

// Status enum per data model: pending, approved, rejected
export const appointmentRequestStatusEnum = pgEnum('appointment_request_status', [
  'pending',
  'approved',
  'rejected',
]);

export const appointmentRequests = pgTable(
  'appointment_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    requestedDate: text('requested_date').notNull(), // ISO date string (YYYY-MM-DD)
    requestedTime: text('requested_time').notNull(), // HH:MM format
    status: appointmentRequestStatusEnum('status').notNull().default('pending'),
    notes: text('notes'), // Optional, up to 1000 characters
    managerNotes: text('manager_notes'), // Optional, for manager comments
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdIdx: index('appointment_requests_user_id_idx').on(table.userId),
    serviceIdIdx: index('appointment_requests_service_id_idx').on(table.serviceId),
    requestedDateIdx: index('appointment_requests_requested_date_idx').on(table.requestedDate),
    statusIdx: index('appointment_requests_status_idx').on(table.status),
    // Composite index for common queries filtering by date and status
    dateStatusIdx: index('appointment_requests_date_status_idx').on(
      table.requestedDate,
      table.status
    ),
  })
);

// Inferred types used elsewhere
export type AppointmentRequest = typeof appointmentRequests.$inferSelect;
export type NewAppointmentRequest = typeof appointmentRequests.$inferInsert;
