import { index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { services } from './services.js';
import { users } from './users.js';

// Standardize enum name and values per data model/contracts
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
    // Transport uses string types; store as text for portability (validation at service layer)
    requestedDate: text('requested_date').notNull(), // ISO date string (YYYY-MM-DD)
    requestedTime: text('requested_time').notNull(), // HH:MM format
    status: appointmentRequestStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    managerNotes: text('manager_notes'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdx: index('appointment_requests_user_idx').on(table.userId),
    serviceIdx: index('appointment_requests_service_idx').on(table.serviceId),
    dateIdx: index('appointment_requests_date_idx').on(table.requestedDate),
    statusIdx: index('appointment_requests_status_idx').on(table.status),
  })
);

export type AppointmentRequest = typeof appointmentRequests.$inferSelect;
export type NewAppointmentRequest = typeof appointmentRequests.$inferInsert;
