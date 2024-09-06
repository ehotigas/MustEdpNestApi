import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { InjectRepository } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Repository } from "typeorm";
import { Demanda } from "./Demanda";

export interface DemandaAdapterInterface {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<Demanda[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<Demanda[]>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Demanda | null>}
     * @throws {InternalServerErrorException}
     */
    find(id: number): Promise<Demanda | null>

    /**
     * @async
     * @param {Omit<Demanda, "Id">} input 
     * @returns {Promise<Demanda>}
     * @throws {InternalServerErrorException}
     */
    save(input: Omit<Demanda, "Id">): Promise<Demanda>

    /**
     * @async
     * @param {number} id 
     * @param {Partial<Demanda>} input 
     * @returns {Promise<Demanda | null>}
     * @throws {InternalServerErrorException}
     */
    update(id: number, input: Partial<Demanda>): Promise<Demanda | null>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Demanda | null>}
     * @throws {InternalServerErrorException}
     */
    remove(id: number): Promise<Demanda | null>
}

@Injectable()
export class DemandaAdapter implements DemandaAdapterInterface {
    private readonly logger: Logger;
    public constructor(
        @InjectRepository(Demanda)
        private readonly repository: Repository<Demanda>,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("DemandaAdapter");
    }

    public async findAll(region: Region): Promise<Demanda[]> {
        try {
            return await this.repository.find({
                where: { Empresa: region }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch all demanda`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async find(id: number): Promise<Demanda | null> {
        try {
            return await this.repository.findOne({
                where: { Id: id }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch demanda with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async save(input: Omit<Demanda, "Id">): Promise<Demanda> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            this.logger.error(`Fail to save demanda`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async update(id: number, input: Partial<Demanda>): Promise<Demanda | null> {
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
            this.logger.error(`Fail to update demanda with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async remove(id: number): Promise<Demanda | null> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.remove(record);
        }
        catch (error) {
            this.logger.error(`Fail to remove demanda with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}