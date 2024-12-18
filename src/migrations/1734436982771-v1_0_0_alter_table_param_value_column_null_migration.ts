import { MigrationInterface, QueryRunner } from "typeorm";

export class V100AlterTableParamValueColumnNullMigration1734436982771 implements MigrationInterface {
    name = 'V100AlterTableParamValueColumnNullMigration1734436982771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`valor\` \`valor\` decimal(15,3) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`valor\` \`valor\` decimal(15,3) NOT NULL`);
    }

}
