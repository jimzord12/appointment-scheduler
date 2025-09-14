import { index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

// Role enum per data model: customer, manager
export const userRoleEnum = pgEnum('user_role', ['customer', 'manager']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // Validation length handled at Zod/service layer
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('customer'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  table => ({
    emailIdx: uniqueIndex('users_email_unique').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
    createdAtIdx: index('users_created_at_idx').on(table.createdAt),
  })
);

// Inferred types used elsewhere
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

