import { PrismaClient } from '@prisma/client';
import * as seeds from './seeds';

const prisma = new PrismaClient();

(async () => {
  await prisma.$queryRaw`TRUNCATE TABLE "UserAccount" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "EmailVerification" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "Tenancy" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "TenancyPlan" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "Account" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "Tag" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "Transaction" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "UserRoles" RESTART IDENTITY CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE "UserProfile" RESTART IDENTITY CASCADE`;

  const tenancy = await seeds.user(prisma);
  await seeds.account(prisma, tenancy);
  await seeds.category(prisma, tenancy);
  await seeds.tag(prisma, tenancy);
  await seeds.transaction(prisma, tenancy);

  prisma.$disconnect();
})();
