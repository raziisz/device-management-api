-- DropIndex
DROP INDEX `devices_part_number_key` ON `devices`;

-- AlterTable
ALTER TABLE `devices` MODIFY `part_number` VARCHAR(128) NOT NULL;
