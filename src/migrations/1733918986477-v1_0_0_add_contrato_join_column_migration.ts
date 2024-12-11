import { MigrationInterface, QueryRunner } from "typeorm";

export class V100AddContratoJoinColumnMigration1733918986477 implements MigrationInterface {
    name = 'V100AddContratoJoinColumnMigration1733918986477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contrato\` ADD \`demandaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`contrato\` ADD UNIQUE INDEX \`IDX_31c54b524766a4e5f99f36717c\` (\`demandaId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_31c54b524766a4e5f99f36717c\` ON \`contrato\` (\`demandaId\`)`);
        await queryRunner.query(`ALTER TABLE \`contrato\` ADD CONSTRAINT \`FK_31c54b524766a4e5f99f36717cb\` FOREIGN KEY (\`demandaId\`) REFERENCES \`param\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contrato\` DROP FOREIGN KEY \`FK_31c54b524766a4e5f99f36717cb\``);
        await queryRunner.query(`DROP INDEX \`REL_31c54b524766a4e5f99f36717c\` ON \`contrato\``);
        await queryRunner.query(`ALTER TABLE \`contrato\` DROP INDEX \`IDX_31c54b524766a4e5f99f36717c\``);
        await queryRunner.query(`ALTER TABLE \`contrato\` DROP COLUMN \`demandaId\``);
    }

}
