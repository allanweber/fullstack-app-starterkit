import { PrismaClient, Tenancy } from '@prisma/client';
import accounts from './data/accounts.json';

export default async function seed(client: PrismaClient, tenancy: Tenancy) {
  const values = accounts.map((acc) => {
    return {
      tenancyId: tenancy.id,
      name: acc.name,
    };
  });

  await client.account.createMany({
    data: values,
  });
}
