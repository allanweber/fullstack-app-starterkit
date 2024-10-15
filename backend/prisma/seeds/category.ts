import { PrismaClient, Tenancy, TransactionType } from '@prisma/client';
import categories from './data/categories.json';

export default async function seed(client: PrismaClient, tenancy: Tenancy) {
  const values = categories.map((cat) => {
    const type = cat.type.toUpperCase();
    return {
      tenancyId: tenancy.id,
      name: cat.name,
      type: TransactionType[type as keyof typeof TransactionType],
    };
  });

  await client.category.createMany({
    data: values,
  });
}
