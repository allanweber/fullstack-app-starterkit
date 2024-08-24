import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const verificationTypeEnum = ['registration', 'reset-password'] as const;

export const emailVerification = sqliteTable('email_verification', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  verificationType: text('verification_type', {
    enum: verificationTypeEnum,
  }).notNull(),
  email: text('email').notNull(),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const emailVerificationRelations = relations(
  emailVerification,
  ({ one }) => ({
    user: one(user, {
      fields: [emailVerification.userId],
      references: [user.id],
    }),
  })
);
