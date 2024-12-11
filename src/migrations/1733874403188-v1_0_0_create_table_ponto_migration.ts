import { MigrationInterface, QueryRunner } from "typeorm";

export class V100CreateTablePontoMigration1733874403188 implements MigrationInterface {
    name = 'V100CreateTablePontoMigration1733874403188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ponto\` (\`id\` varchar(3) NOT NULL, \`nome\` varchar(255) NOT NULL, \`empresa\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`ponto\``);
    }

}
