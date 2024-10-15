import { PrismaClient, Tenancy, TransactionType } from '@prisma/client';
import transactionsArray from './data/transactions.json';

export default async function seed(client: PrismaClient, tenancy: Tenancy) {
  await Promise.all(
    transactionsArray.map(async (trans) => {
      const account = await client.account.findFirst({
        where: {
          name: trans.account,
        },
      });

      if (!account) {
        throw new Error(`Account ${trans.account} not found`);
      }

      const category = await client.category.findFirst({
        where: {
          name: trans.category,
        },
      });

      if (!category) {
        throw new Error(`Category ${trans.category} not found`);
      }

      const tags = await Promise.all(
        trans.tags.map(async (tag) => {
          const dbTag = await client.tag.findFirst({
            where: {
              name: tag,
            },
          });

          if (!dbTag) {
            throw new Error(`Tag ${tag} not found`);
          }

          return {
            id: dbTag.id,
          };
        })
      );

      const type = trans.type.toUpperCase();
      await client.transaction.create({
        data: {
          tenancyId: tenancy.id,
          accountId: account.id,
          categoryId: category.id,
          date: randomDate(),
          type: TransactionType[type as keyof typeof TransactionType],
          amount: trans.amount,
          description: trans.description,
          tags: {
            connect: tags.map((tag) => tag as any as { id: number }),
          },
        },
      });
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
  return date;
}
