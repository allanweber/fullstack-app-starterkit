import { relations, sql } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { account } from './account';
import { category, categoryType } from './category';
import { tag } from './tag';
import { tenancy } from './tenancy';

export const transactions = sqliteTable('transactions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tenancyId: text('tenancy_id')
    .notNull()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  accountId: integer('account_id')
    .notNull()
    .references(() => account.id, { onDelete: 'cascade' }),
  date: integer('date', { mode: 'number' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  amount: real('amount').notNull(),
  categoryId: integer('category_id').references(() => category.id, {
    onDelete: 'cascade',
  }),
  type: text('type', { enum: categoryType }).notNull(),
  description: text('description').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    tenancy: one(tenancy, {
      fields: [transactions.tenancyId],
      references: [tenancy.id],
    }),
    account: one(account, {
      fields: [transactions.accountId],
      references: [account.id],
    }),
    category: one(category, {
      fields: [transactions.categoryId],
      references: [category.id],
    }),
    tags: many(transactionsTag),
  })
);

export const transactionsTag = sqliteTable(
  'transactions_tags',
  {
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.transactionId, t.tagId] }),
  })
);

export const transactionsTagRelations = relations(
  transactionsTag,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionsTag.transactionId],
      references: [transactions.id],
    }),
    tag: one(tag, {
      fields: [transactionsTag.tagId],
      references: [tag.id],
    }),
  })
);
