import { MigrationInterface, QueryRunner } from "typeorm";

export class V100AlterTableParamCenarioColumnNullMigration1734535408451 implements MigrationInterface {
    name = 'V100AlterTableParamCenarioColumnNullMigration1734535408451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`cenario\` \`cenario\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`cenario\` \`cenario\` varchar(255) NOT NULL`);
    }

}
