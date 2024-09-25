import { eq } from 'drizzle-orm';
import db from '..';
import { account, transactions, transactionsTag } from '../schema';
import { tenancy } from '../schema/tenancy';
import { category } from './../schema/category';
import transactionsArray from './data/transactions.json';

export default async function seed(db: db) {
  const tenancyId = await db.query.tenancy.findFirst({
    where: eq(tenancy.name, 'allan@mail.com'),
  });

  if (!tenancyId) {
    throw new Error('Tenancy not found');
  }

  await Promise.all(
    transactionsArray.map(async (trans) => {
      const acc = await db.query.account.findFirst({
        where: eq(account.name, trans.account),
      });

      if (!acc) {
        throw new Error(`Account ${trans.account} not found`);
      }

      const cat = await db.query.category.findFirst({
        where: eq(category.name, trans.category),
      });

      if (!cat) {
        throw new Error(`Category ${trans.category} not found`);
      }

      const [newTrans] = await db
        .insert(transactions)
        .values({
          tenancyId: tenancyId.id,
          accountId: acc.id,
          date: randomDate(),
          amount: trans.amount,
          categoryId: cat.id,
          type: trans.type as 'income' | 'expense' | 'investment',
          description: trans.description,
        })
        .returning();

      const tagValues = await Promise.all(
        trans.tags.map(async (tag) => {
          const tg = await db.query.tag.findFirst({
            where: eq(category.name, tag),
          });

          if (!tg) {
            throw new Error(`Tag ${tag} not found`);
          }

          return {
            transactionId: newTrans.id,
            tagId: tg.id,
          };
        })
      );

      await db.insert(transactionsTag).values(tagValues);
    })
  );
}

function randomDate() {
  //start 90 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  const start = startDate.getTime();

  //end yesterday
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const end = endDate.getTime();

  const date = new Date(+start + Math.random() * (end - start));
  const hour = (0 + Math.random() * (23 - 0)) | 0;
  date.setHours(hour);
  return date.getTime();
}
