import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { InjectRepository } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Repository } from "typeorm";
import { Tarifa } from "./Tarifa";

export interface ITarifaAdapter {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<Tarifa[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<Tarifa[]>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    find(id: number): Promise<Tarifa>

    /**
     * @async
     * @param {Omit<Tarifa, "Id">} input 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    save(input: Omit<Tarifa, "Id">): Promise<Tarifa>

    /**
     * @async
     * @param {number} id 
     * @param {Partial<Tarifa>} input 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    update(id: number, input: Partial<Tarifa>): Promise<Tarifa>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    remove(id: number): Promise<Tarifa>
}

@Injectable()
export class TarifaAdapter implements ITarifaAdapter {
    private readonly logger: Logger;
    public constructor(
        @InjectRepository(Tarifa)
        private readonly repository: Repository<Tarifa>,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("TarifaAdapter");
    }

    public async findAll(region: Region): Promise<Tarifa[]> {
        try {
            return await this.repository.find({
                where: { Empresa: region }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch all tarifa`, error.stack)
            throw new InternalServerErrorException(error.message);
        }
    }

    public async find(id: number): Promise<Tarifa> {
        try {
            return await this.repository.findOne({
                where: { Id: id }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch tarifa with id: ${id}`, error.stack)
            throw new InternalServerErrorException(error.message);
        }
    }

    public async save(input: Omit<Tarifa, "Id">): Promise<Tarifa> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            this.logger.error(`Fail to save tarifa`, error.stack)
            throw new InternalServerErrorException(error.message);
        }
    }

    public async update(id: number, input: Partial<Tarifa>): Promise<Tarifa> {
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
            this.logger.error(`Fail to update tarifa with id: ${id}`, error.stack)
            throw new InternalServerErrorException(error.message);
        }
    }

    public async remove(id: number): Promise<Tarifa> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.remove(record);
        }
        catch (error) {
            this.logger.error(`Fail to remove tarifa with id: ${id}`, error.stack)
            throw new InternalServerErrorException(error.message);
        }
    }
}