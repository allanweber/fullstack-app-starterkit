-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_USER', 'USER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'TWITTER');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('REGISTRATION', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'INVESTMENT');

-- CreateTable
CREATE TABLE "Tenancy" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenancyPlan" (
    "id" SERIAL NOT NULL,
    "tenancyId" INTEGER NOT NULL,
    "isFree" BOOLEAN NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenancyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "tenancyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" INTEGER NOT NULL,
    "displayName" VARCHAR(100),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "dateOfBirth" TIMESTAMP(3),
    "image" TEXT,
    "bio" VARCHAR(512),
    "locale" VARCHAR(10),
    "theme" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "userId" INTEGER NOT NULL,
    "type" "AccountType" NOT NULL,
    "passwordHash" VARCHAR(255),
    "salt" VARCHAR(255),
    "googleId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EmailVerification" (
    "userId" INTEGER NOT NULL,
    "type" "VerificationType" NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "tenancyId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "tenancyId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tenancyId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tenancyId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTransaction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_userId_key" ON "UserAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_googleId_key" ON "UserAccount"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_userId_key" ON "EmailVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTransaction_AB_unique" ON "_TagToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTransaction_B_index" ON "_TagToTransaction"("B");

-- AddForeignKey
ALTER TABLE "TenancyPlan" ADD CONSTRAINT "TenancyPlan_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTransaction" ADD CONSTRAINT "_TagToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTransaction" ADD CONSTRAINT "_TagToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
