import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { organization } from './organization';

export const user = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  email: text('email').notNull().unique(),
  email_verified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  organizationId: integer('organization_id')
    .notNull()
    .unique()
    .references(() => organization.id, { onDelete: 'cascade' }),
});

export const userRelations = relations(user, ({ one }) => ({
  user: one(organization, {
    fields: [user.id],
    references: [organization.id],
  }),
}));
