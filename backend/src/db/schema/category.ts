import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tenancy } from './tenancy';

export const categoryType = ['income', 'expense', 'investment'] as const;

export const category = sqliteTable('category', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tenancyId: text('tenancy_id')
    .notNull()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type', { enum: categoryType }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const categoryTenancy = relations(category, ({ one }) => ({
  tenancy: one(tenancy, {
    fields: [category.tenancyId],
    references: [tenancy.id],
  }),
}));
