import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tenancy } from './tenancy';

export const user = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  email: text('email').notNull().unique(),
  email_verified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  tenancyId: text('tenancy_id')
    .notNull()
    .unique()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const userRelations = relations(user, ({ one }) => ({
  user: one(tenancy, {
    fields: [user.id],
    references: [tenancy.id],
  }),
}));
