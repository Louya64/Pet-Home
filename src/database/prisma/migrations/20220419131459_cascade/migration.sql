

ALTER TABLE `Photos` DROP FOREIGN KEY `Photos_id_offer_fkey`;
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
