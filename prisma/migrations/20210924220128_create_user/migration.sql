-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'FACEBOOK', 'TWITTER', 'GITHUB');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "provider" "Provider",
    "providerId" TEXT,
    "bio" TEXT,
    "profilePhoto" TEXT,
    "coverPhoto" TEXT,
    "phone" TEXT,
    "birthday" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetPasswordToken" TEXT,
    "resetPasswordExpiration" BIGINT,
    "confirmationToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");
