-- AlterTable
ALTER TABLE `custom_mode_orders` ADD COLUMN `final_price` DOUBLE NULL,
    ADD COLUMN `paid_amount` DOUBLE NOT NULL DEFAULT 0;
