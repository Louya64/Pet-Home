

ALTER TABLE `Adoption_requests` DROP FOREIGN KEY `Adoption_requests_id_offer_fkey`;
ALTER TABLE `Adoption_requests` ADD CONSTRAINT `Adoption_requests_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
