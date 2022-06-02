/*
  Warnings:

  - You are about to drop the column `candidate_contact` on the `adoption_requests` table. All the data in the column will be lost.
  - You are about to alter the column `adoption_date` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `candidate_email` to the `Adoption_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adoption_requests` DROP COLUMN `candidate_contact`,
    ADD COLUMN `candidate_email` VARCHAR(150) NOT NULL,
    ADD COLUMN `candidate_phone` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `offers` MODIFY `adoption_date` TIMESTAMP NULL;
