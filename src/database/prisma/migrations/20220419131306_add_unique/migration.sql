/*
  Warnings:

  - You are about to drop the column `id_adoptionRequest` on the `messages` table. All the data in the column will be lost.
  - You are about to alter the column `adoption_date` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `adoptionrequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `adoptionstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offerstatus` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Races` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_adoption_request` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `adoptionrequests` DROP FOREIGN KEY `AdoptionRequests_id_adoption_status_fkey`;

-- DropForeignKey
ALTER TABLE `adoptionrequests` DROP FOREIGN KEY `AdoptionRequests_id_candidate_fkey`;

-- DropForeignKey
ALTER TABLE `adoptionrequests` DROP FOREIGN KEY `AdoptionRequests_id_offer_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_id_adoptionRequest_fkey`;

-- DropForeignKey
ALTER TABLE `offers` DROP FOREIGN KEY `Offers_id_status_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `id_adoptionRequest`,
    ADD COLUMN `id_adoption_request` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `offers` MODIFY `adoption_date` TIMESTAMP NULL;

-- DropTable
DROP TABLE `adoptionrequests`;

-- DropTable
DROP TABLE `adoptionstatus`;

-- DropTable
DROP TABLE `offerstatus`;

-- CreateTable
CREATE TABLE `Offer_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Offer_status_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adoption_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_offer` INTEGER NOT NULL,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `candidate_contact` VARCHAR(150) NOT NULL,
    `id_candidate` INTEGER NULL,
    `id_adoption_status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adoption_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Adoption_status_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Categories_name_key` ON `Categories`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Races_name_key` ON `Races`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Roles_name_key` ON `Roles`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_email_key` ON `Users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_username_key` ON `Users`(`username`);

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `Offer_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adoption_requests` ADD CONSTRAINT `Adoption_requests_id_candidate_fkey` FOREIGN KEY (`id_candidate`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adoption_requests` ADD CONSTRAINT `Adoption_requests_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adoption_requests` ADD CONSTRAINT `Adoption_requests_id_adoption_status_fkey` FOREIGN KEY (`id_adoption_status`) REFERENCES `Adoption_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_id_adoption_request_fkey` FOREIGN KEY (`id_adoption_request`) REFERENCES `Adoption_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
