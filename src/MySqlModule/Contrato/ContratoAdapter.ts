import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { InjectRepository } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Contrato } from "./Contrato";
import { Repository } from "typeorm";

export interface IContratoAdapter {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<Contrato[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<Contrato[]>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Contrato | null>}
     * @throws {InternalServerErrorException}
     */
    find(id: number): Promise<Contrato | null>

    /**
     * @async
     * @param {Omit<Contrato, "Id">} input 
     * @returns {Promise<Contrato>}
     * @throws {InternalServerErrorException}
     */
    save(input: Omit<Contrato, "Id">): Promise<Contrato>

    /**
     * @async
     * @param {number} id 
     * @param {Partial<Contrato>} input 
     * @returns {Promise<Contrato | null>}
     * @throws {InternalServerErrorException}
     */
    update(id: number, input: Partial<Contrato>): Promise<Contrato | null>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Contrato | null>}
     * @throws {InternalServerErrorException}
     */
    remove(id: number): Promise<Contrato | null>
}


@Injectable()
export class ContratoAdapter implements IContratoAdapter {
    private readonly logger: Logger;
    public constructor(
        @InjectRepository(Contrato)
        private readonly repository: Repository<Contrato>,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("ContratoAdapter");
    }

    public async findAll(region: Region): Promise<Contrato[]> {
        try {
            return await this.repository.find({
                where: { Empresa: region }
            });
        }
        catch (error) {
            this.logger.error("Fail to fetch all Contratos", error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async find(id: number): Promise<Contrato> {
        try {
            return await this.repository.findOne({
                where: { Id: id }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch contrato with id : ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async save(input: Omit<Contrato, "Id">): Promise<Contrato> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            this.logger.error(`Fail to save new contrato`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.save({
                ...record,
                ...input
            });
        }
        catch (error) {
            this.logger.error(`Fail to update contrato with id : ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async remove(id: number): Promise<Contrato> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.remove(record);
        }
        catch (error) {
            this.logger.error(`Fail to remove contrato with id : ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}