import { Prisma, PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient().$extends({
  model: {
    $allModels: {
      async findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
      ): Promise<{
        data: Prisma.Result<Model, Args, 'findMany'>;
        count: number;
      }> {
        const [data, count] = await Promise.all([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where }),
        ]);

        return { data, count };
      },
    },
  },
});
