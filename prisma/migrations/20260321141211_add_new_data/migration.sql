/*
  Warnings:

  - Added the required column `clientId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `custommodeorder` ADD COLUMN `guestClientId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `clientId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `GuestClient` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `ville` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomModeOrder` ADD CONSTRAINT `CustomModeOrder_guestClientId_fkey` FOREIGN KEY (`guestClientId`) REFERENCES `GuestClient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
