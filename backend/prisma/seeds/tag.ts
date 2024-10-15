import { PrismaClient, Tenancy } from '@prisma/client';
import tags from './data/tags.json';

export default async function seed(client: PrismaClient, tenancy: Tenancy) {
  const values = tags.map((tg) => {
    return {
      tenancyId: tenancy.id,
      name: tg.name,
      color: tg.color,
    };
  });

  await client.tag.createMany({
    data: values,
  });
}
