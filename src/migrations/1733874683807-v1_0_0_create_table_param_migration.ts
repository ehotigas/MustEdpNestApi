import { MigrationInterface, QueryRunner } from "typeorm";

export class V100CreateTableParamMigration1733874683807 implements MigrationInterface {
    name = 'V100CreateTableParamMigration1733874683807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`param\` (\`id\` int NOT NULL AUTO_INCREMENT, \`posto\` varchar(255) NOT NULL, \`data\` datetime NOT NULL, \`tipo_dado\` varchar(255) NOT NULL, \`cenario\` varchar(255) NOT NULL, \`valor\` decimal NOT NULL, \`pontoId\` varchar(3) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`param\` ADD CONSTRAINT \`FK_13055b5c7000c28eaf28edb8ebf\` FOREIGN KEY (\`pontoId\`) REFERENCES \`ponto\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` DROP FOREIGN KEY \`FK_13055b5c7000c28eaf28edb8ebf\``);
        await queryRunner.query(`DROP TABLE \`param\``);
    }

}
