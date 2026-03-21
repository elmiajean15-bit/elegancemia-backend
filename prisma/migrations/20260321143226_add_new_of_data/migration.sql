-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_clientId_fkey`;

-- DropIndex
DROP INDEX `Review_clientId_fkey` ON `review`;

-- AlterTable
ALTER TABLE `review` MODIFY `clientId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
