SET default_storage_engine=INNODB;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_role` INTEGER NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(250) NULL,
    `facebook_token` VARCHAR(250) NULL,
    `username` VARCHAR(150) NULL,
    `firstname` VARCHAR(150) NULL,
    `lastname` VARCHAR(150) NULL,
    `phone_number` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `adoption_date` TIMESTAMP NULL,
    `id_status` INTEGER NOT NULL,
    `animal_name` VARCHAR(150) NULL,
    `age` INTEGER NOT NULL,
    `id_category` INTEGER NOT NULL,
    `id_race` INTEGER NULL,
    `zipcode` INTEGER NOT NULL,
    `city` VARCHAR(150) NOT NULL,
    `identified` BOOLEAN NOT NULL,
    `vaccinated` BOOLEAN NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    `disability` VARCHAR(250) NULL,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfferStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `id_parent_category` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Races` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_category` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_offer` INTEGER NOT NULL,
    `main` BOOLEAN NOT NULL,
    `path` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdoptionRequests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_offer` INTEGER NOT NULL,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `candidate_contact` VARCHAR(150) NOT NULL,
    `id_candidate` INTEGER NULL,
    `id_adoption_status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdoptionStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_adoptionRequest` INTEGER NOT NULL,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_author` INTEGER NULL,
    `text` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `OfferStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_id_race_fkey` FOREIGN KEY (`id_race`) REFERENCES `Races`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categories` ADD CONSTRAINT `Categories_id_parent_category_fkey` FOREIGN KEY (`id_parent_category`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Races` ADD CONSTRAINT `Races_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequests` ADD CONSTRAINT `AdoptionRequests_id_candidate_fkey` FOREIGN KEY (`id_candidate`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequests` ADD CONSTRAINT `AdoptionRequests_id_offer_fkey` FOREIGN KEY (`id_offer`) REFERENCES `Offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequests` ADD CONSTRAINT `AdoptionRequests_id_adoption_status_fkey` FOREIGN KEY (`id_adoption_status`) REFERENCES `AdoptionStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_id_author_fkey` FOREIGN KEY (`id_author`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_id_adoptionRequest_fkey` FOREIGN KEY (`id_adoptionRequest`) REFERENCES `AdoptionRequests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
