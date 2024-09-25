import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tenancy } from './tenancy';
import { transactionsTag } from './transactions';

export const tag = sqliteTable('tag', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tenancyId: text('tenancy_id')
    .notNull()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const tagRelations = relations(tag, ({ one, many }) => ({
  tenancy: one(tenancy, {
    fields: [tag.tenancyId],
    references: [tenancy.id],
  }),
  transactions: many(transactionsTag),
}));
