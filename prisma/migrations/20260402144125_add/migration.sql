/*
  Warnings:

  - You are about to drop the `testimonial` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `admins` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `testimonial`;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'mode',
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `testimonials_is_published_idx`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
