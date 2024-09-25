import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tenancy } from './tenancy';

export const account = sqliteTable('account', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tenancyId: text('tenancy_id')
    .notNull()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const accountTenancy = relations(account, ({ one }) => ({
  tenancy: one(tenancy, {
    fields: [account.tenancyId],
    references: [tenancy.id],
  }),
}));
