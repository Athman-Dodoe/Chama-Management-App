-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TREASURER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ChamaRole" AS ENUM ('CHAIRPERSON', 'TREASURER', 'SECRETARY', 'MEMBER');

-- CreateEnum
CREATE TYPE "ChamaType" AS ENUM ('MERRY_GO_ROUND', 'SAVINGS_AND_LOAN', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXITED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "nationalId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chama" (
    "id" TEXT NOT NULL,
    "chamaCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "registrationNumber" TEXT,
    "type" "ChamaType" NOT NULL DEFAULT 'SAVINGS_AND_LOAN',
    "contributionFrequency" "Frequency" NOT NULL DEFAULT 'MONTHLY',
    "contributionAmount" DECIMAL(12,2) NOT NULL,
    "payoutOrderStrategy" TEXT DEFAULT 'SEQUENTIAL_ROTATION',
    "paybillNumber" TEXT DEFAULT '600991',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chamaId" TEXT NOT NULL,
    "memberNumber" TEXT NOT NULL,
    "roleInChama" "ChamaRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "rotationIndex" INTEGER,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chama_chamaCode_key" ON "Chama"("chamaCode");

-- CreateIndex
CREATE UNIQUE INDEX "Chama_registrationNumber_key" ON "Chama"("registrationNumber");

-- CreateIndex
CREATE INDEX "Chama_chamaCode_idx" ON "Chama"("chamaCode");

-- CreateIndex
CREATE INDEX "Chama_createdById_idx" ON "Chama"("createdById");

-- CreateIndex
CREATE INDEX "Membership_memberNumber_idx" ON "Membership"("memberNumber");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_chamaId_idx" ON "Membership"("chamaId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_chamaId_memberNumber_key" ON "Membership"("chamaId", "memberNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_chamaId_userId_key" ON "Membership"("chamaId", "userId");

-- AddForeignKey
ALTER TABLE "Chama" ADD CONSTRAINT "Chama_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_chamaId_fkey" FOREIGN KEY ("chamaId") REFERENCES "Chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;
