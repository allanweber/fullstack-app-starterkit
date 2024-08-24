import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tenancy } from './tenancy';

export const tenancyPlan = sqliteTable('tenancy_plan', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tenancyId: text('tenancy_id')
    .notNull()
    .references(() => tenancy.id, { onDelete: 'cascade' }),
  isFree: integer('is_free', { mode: 'boolean' }),
  startsAt: integer('starts_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripePriceId: text('stripe_price_id').unique(),
});

export const userPlansRelations = relations(tenancyPlan, ({ one }) => ({
  user: one(tenancy, {
    fields: [tenancyPlan.tenancyId],
    references: [tenancy.id],
  }),
}));
