import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const services = pgTable(
  'services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    durationMinutes: integer('duration_minutes').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  table => ({
    nameIdx: index('services_name_idx').on(table.name),
    activeIdx: index('services_active_idx').on(table.isActive),
  })
);

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

