import { AccountType, PrismaClient, Role } from '@prisma/client';
import {
  createDate,
  generateUUID,
  hashPassword,
  TimeSpan,
} from '../../src/utils/randoms';

export default async function seed(client: PrismaClient) {
  const email = 'allan@mail.com';
  const password = '12345678';
  const saltPassword = generateUUID();
  const passwordHash = await hashPassword(saltPassword, password);

  const tenancy = await client.tenancy.create({
    data: {
      name: email,
    },
  });

  await client.tenancyPlan.create({
    data: {
      tenancyId: tenancy.id,
      isFree: true,
      startsAt: new Date(),
      expiresAt: createDate(new TimeSpan(1, 'y')),
    },
  });

  const user = await client.user.create({
    data: {
      email,
      emailVerified: true,
      tenancyId: tenancy.id,
    },
  });

  await client.userAccount.create({
    data: {
      userId: user.id,
      type: AccountType.EMAIL,
      passwordHash,
      salt: saltPassword,
    },
  });

  await client.userRoles.create({
    data: {
      userId: user.id,
      role: Role.SUPER_USER,
    },
  });

  await client.userProfile.create({
    data: {
      userId: user.id,
      displayName: email,
      theme: 'light',
      locale: 'en',
    },
  });

  return tenancy;
}
