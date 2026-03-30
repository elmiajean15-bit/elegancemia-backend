-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `full_name` VARCHAR(191) NULL,
    ADD COLUMN `payment_reference` VARCHAR(191) NULL,
    ADD COLUMN `payment_status` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `shipping_method_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `fedapay_id` VARCHAR(191) NULL,
    ADD COLUMN `payment_url` VARCHAR(191) NULL,
    ADD COLUMN `raw_response` JSON NULL,
    ADD COLUMN `reference` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_method_id_fkey` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
