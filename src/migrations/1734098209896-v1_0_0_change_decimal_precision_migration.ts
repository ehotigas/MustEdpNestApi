import { MigrationInterface, QueryRunner } from "typeorm";

export class V100ChangeDecimalPrecisionMigration1734098209896 implements MigrationInterface {
    name = 'V100ChangeDecimalPrecisionMigration1734098209896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_31c54b524766a4e5f99f36717c\` ON \`contrato\``);
        await queryRunner.query(`ALTER TABLE \`contrato\` CHANGE \`valor\` \`valor\` decimal(15,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`valor\` \`valor\` decimal(15,3) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` CHANGE \`valor\` \`valor\` decimal(10,0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`contrato\` CHANGE \`valor\` \`valor\` decimal(10,0) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_31c54b524766a4e5f99f36717c\` ON \`contrato\` (\`demandaId\`)`);
    }

}
