import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IContratoQueryGenerator } from "./contrato-sql-query";
import { InjectRepository } from "@nestjs/typeorm";
import { Param } from "../param/param.entity";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";
import { Repository } from "typeorm";


export interface IContratoAdapter {
    generate(year: number): Promise<string>;
    findByDemanda(demanda: Param): Promise<Contrato>;
    save(input: Omit<Contrato, "id">): Promise<Contrato>;
    update(id: number, input: Partial<Contrato>): Promise<Contrato>;
    remove(id: number): Promise<Contrato>;
}


@Injectable()
export class ContratoAdapter implements IContratoAdapter {
    private readonly logger = new Logger(ContratoAdapter.name);
    public constructor(
        @InjectRepository(Contrato)
        private readonly repository: Repository<Contrato>,
        @Inject(Providers.ContratoQueryGenerator)
        private readonly queryGenerator: IContratoQueryGenerator
    ) {  }

    public async generate(year: number): Promise<string> {
        try {
            const queryList = this.queryGenerator.generate(year);

            for (const query of queryList) {
                await this.repository.query(query);
            }
            return `Contratos gerados`;
        }
        catch (error) {
            this.logger.error(`Fail to generate contratos for year: ${year}`, error.stack);
            throw new InternalServerErrorException(`Fail to generate contratos for year: ${year}`, error.message);
        }
    }

    public async findByDemanda(demanda: Param): Promise<Contrato> {
        try {
            return await this.repository.findOne({
                where: { demanda }
            });
        }
        catch (error) {
            this.logger.error(`Fail to find contrato with demanda id: ${demanda.id}`, error.stack);
            throw new InternalServerErrorException(`Fail to find contrato with demanda id: ${demanda.id}`, error.message);
        }
    }

    public async save(input: Omit<Contrato, "id">): Promise<Contrato> {
        try {
            return await this.repository.save(input);
        }
        catch(error) {
            this.logger.error(`Fail to save new contrato`, error.stack);
            throw new InternalServerErrorException(`Fail to save new contrato`, error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save({ ...contrato, ...input });
        }
        catch(error) {
            this.logger.error(`Fail to update contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to update contrato with id: ${id}`, error.message);
        }
    }

    public async remove(id: number): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(contrato);
        }
        catch(error) {
            this.logger.error(`Fail to remove contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove contrato with id: ${id}`, error.message);
        }
    }
}