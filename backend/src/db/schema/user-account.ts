import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const accountTypeEnum = ['email', 'google'] as const;

export const userAccounts = sqliteTable('user_accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountType: text('account_type', { enum: accountTypeEnum }).notNull(),
  passwordHash: text('password_hash'),
  salt: text('salt'),
  googleId: text('google_id').unique(),
});

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(user, {
    fields: [userAccounts.userId],
    references: [user.id],
  }),
}));
