/*
  Warnings:

  - You are about to alter the column `adoption_date` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `photos` DROP FOREIGN KEY `Photos_id_offer_fkey`;

-- AlterTable
ALTER TABLE `offers` MODIFY `adoption_date` TIMESTAMP NULL;

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
