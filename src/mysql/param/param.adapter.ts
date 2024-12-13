import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Param } from "./param.entity";
import { Repository } from "typeorm";
import { DataType } from "./data-type";
import { Posto } from "src/types/posto";
import { Ponto } from "../ponto/ponto.entity";


export interface IParamAdapter {
    findAll(filters: Param): Promise<Param[]>;
    findById(id: number): Promise<Param>;
    findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date, tipoDado: DataType, cenario: string): Promise<Param>;
    save(input: Omit<Param, "id">): Promise<Param>;
    update(id: number, input: Partial<Param>): Promise<Param>;
    remove(id: number): Promise<Param>;
}


@Injectable()
export class ParamAdapter implements IParamAdapter {
    private readonly logger = new Logger(ParamAdapter.name);
    public constructor(
        @InjectRepository(Param)
        private readonly repository: Repository<Param>
    ) {  }

    public async findAll(filters: Param): Promise<Param[]> {
        try {
            return await this.repository.find({
                where: filters,
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find all param`, error.stack);
            throw new InternalServerErrorException(`Fail to find all param`, error.message);
        }
    }

    public async findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date, tipoDado: DataType, cenario: string): Promise<Param> {
        try {
            return await this.repository.findOne({
                where: { ponto, posto, data, tipoDado, cenario },
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find param with ponto: ${ponto}, posto: ${posto}, data: ${data}, tipoDado: ${tipoDado}, cenario: ${cenario}`, error.stack);
            throw new InternalServerErrorException(`Fail to find param with ponto: ${ponto}, posto: ${posto}, data: ${data}, tipoDado: ${tipoDado}, cenario: ${cenario}`, error.message);
        }
    }

    public async findById(id: number): Promise<Param> {
        try {
            return await this.repository.findOne({
                where: { id },
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to find param with id: ${id}`, error.message);
        }
    }

    public async save(input: Omit<Param, "id">): Promise<Param> {
        try {
            return await this.repository.save(input);
        }
        catch(error) {
            this.logger.error(`Fail to save param`, error.stack);
            throw new InternalServerErrorException(`Fail to save param`, error.message);
        }
    }

    public async update(id: number, input: Partial<Param>): Promise<Param> {
        try {
            const param = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save({ ...param, ...input });
        }
        catch(error) {
            this.logger.error(`Fail to update param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to update param with id: ${id}`, error.message);
        }
    }

    public async remove(id: number): Promise<Param> {
        try {
            const param = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(param);
        }
        catch(error) {
            this.logger.error(`Fail to remove param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove param with id: ${id}`, error.message);
        }
    }
}