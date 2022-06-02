/*
  Warnings:

  - You are about to alter the column `adoption_date` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `offers` MODIFY `adoption_date` TIMESTAMP NULL;
