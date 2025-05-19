import { MigrationInterface, QueryRunner } from "typeorm";

export class V100CreateProjectTablesMigration1747657937896 implements MigrationInterface {
    name = 'V100CreateProjectTablesMigration1747657937896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contrato\` (\`id\` int NOT NULL AUTO_INCREMENT, \`contratoPonta\` decimal(15,3) NOT NULL, \`contratoForaPonta\` decimal(15,3) NOT NULL, \`demandaId\` int NULL, UNIQUE INDEX \`REL_31c54b524766a4e5f99f36717c\` (\`demandaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`param\` (\`id\` int NOT NULL AUTO_INCREMENT, \`data\` datetime NOT NULL, \`cenario\` varchar(255) NULL, \`tarifaPonta\` decimal(15,3) NULL, \`tarifaForaPonta\` decimal(15,3) NULL, \`demandaPonta\` decimal(15,3) NULL, \`demandaForaPonta\` decimal(15,3) NULL, \`confiabilidadePonta\` decimal(15,3) NULL, \`confiabilidadeForaPonta\` decimal(15,3) NULL, \`pontoId\` varchar(3) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ponto\` (\`id\` varchar(3) NOT NULL, \`nome\` varchar(255) NOT NULL, \`empresa\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`contrato\` ADD CONSTRAINT \`FK_31c54b524766a4e5f99f36717cb\` FOREIGN KEY (\`demandaId\`) REFERENCES \`param\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`param\` ADD CONSTRAINT \`FK_13055b5c7000c28eaf28edb8ebf\` FOREIGN KEY (\`pontoId\`) REFERENCES \`ponto\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`param\` DROP FOREIGN KEY \`FK_13055b5c7000c28eaf28edb8ebf\``);
        await queryRunner.query(`ALTER TABLE \`contrato\` DROP FOREIGN KEY \`FK_31c54b524766a4e5f99f36717cb\``);
        await queryRunner.query(`DROP TABLE \`ponto\``);
        await queryRunner.query(`DROP TABLE \`param\``);
        await queryRunner.query(`DROP INDEX \`REL_31c54b524766a4e5f99f36717c\` ON \`contrato\``);
        await queryRunner.query(`DROP TABLE \`contrato\``);
    }

}
