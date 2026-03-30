/*
  Warnings:

  - Made the column `address` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `full_name` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_client_id_fkey`;

-- DropIndex
DROP INDEX `orders_client_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` MODIFY `client_id` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `full_name` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
