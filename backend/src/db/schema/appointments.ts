import { pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { appointmentRequests } from './appointment_requests.js';

export const appointments = pgTable(
  'appointments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id')
      .notNull()
      .references(() => appointmentRequests.id, { onDelete: 'cascade' }),
    confirmedAt: timestamp('confirmed_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  table => ({
    requestUnique: uniqueIndex('appointments_request_unique').on(table.requestId),
  })
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
