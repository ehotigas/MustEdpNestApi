import { MigrationInterface, QueryRunner } from "typeorm";

export class V100AlterTableChangeDateColumnToDateTypeMigration1747924112616 implements MigrationInterface {
    name = 'V100AlterTableChangeDateColumnToDateTypeMigration1747924112616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` DROP COLUMN \`data\``);
        await queryRunner.query(`ALTER TABLE \`param\` ADD \`data\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` DROP COLUMN \`data\``);
        await queryRunner.query(`ALTER TABLE \`param\` ADD \`data\` datetime NOT NULL`);
    }

}
