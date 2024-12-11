import { MigrationInterface, QueryRunner } from "typeorm";

export class V100CreateTableContratoMigration1733916810145 implements MigrationInterface {
    name = 'V100CreateTableContratoMigration1733916810145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contrato\` (\`id\` int NOT NULL AUTO_INCREMENT, \`valor\` decimal NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`contrato\``);
    }

}
