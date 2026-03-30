/*
  Warnings:

  - You are about to drop the `_producttoproducttag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_producttoproducttag` DROP FOREIGN KEY `_ProductToProductTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttoproducttag` DROP FOREIGN KEY `_ProductToProductTag_B_fkey`;

-- DropTable
DROP TABLE `_producttoproducttag`;

-- CreateTable
CREATE TABLE `product_to_product_tag` (
    `product_id` VARCHAR(191) NOT NULL,
    `tag_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_to_product_tag` ADD CONSTRAINT `product_to_product_tag_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_to_product_tag` ADD CONSTRAINT `product_to_product_tag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `product_tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
