import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const roleEnum = ['admin', 'super-user', 'user'] as const;

export const userRoles = sqliteTable('user_roles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role', { enum: roleEnum }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
}));
