import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { InjectRepository } from "@nestjs/typeorm";
import { Confiabilidade } from "./Confiabilidade";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Repository } from "typeorm";

export interface IConfiabilidadeAdapter {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<Confiabilidade[]>}
     * @throws {InternalServerErrorException}
     */
    findAll: (region: Region) => Promise<Confiabilidade[]>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Confiabilidade | null>}
     * @throws {InternalServerErrorException}
     */
    find: (id: number) => Promise<Confiabilidade | null>

    /**
     * @async
     * @param {Omit<Confiabilidade, "Id">} input 
     * @returns {Promise<Confiabilidade>}
     * @throws {InternalServerErrorException}
     */
    save: (input: Omit<Confiabilidade, "Id">) => Promise<Confiabilidade>

    /**
     * @async
     * @param {number} id 
     * @param {Confiabilidade} input 
     * @returns {Promise<Confiabilidade | null>}
     * @throws {InternalServerErrorException}
     */
    update: (id: number, input: Partial<Confiabilidade>) => Promise<Confiabilidade | null>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Confiabilidade | null>}
     * @throws {InternalServerErrorException}
     */
    remove(id: number): Promise<Confiabilidade | null>
}

@Injectable()
export class ConfiabilidadeAdapter implements IConfiabilidadeAdapter {
    private readonly logger: Logger;
    public constructor(
        @InjectRepository(Confiabilidade)
        private readonly repository: Repository<Confiabilidade>,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("ConfiabilidadeAdapter");
    }

    public async findAll(region: Region): Promise<Confiabilidade[]> {
        try {
            return await this.repository.find({
                where: { Empresa: region }
            });
        }
        catch (error) {
            this.logger.error("Fail to fetch all Confiabilidade", error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async find(id: number): Promise<Confiabilidade | null> {
        try {
            return await this.repository.findOne({
                where: { Id: id }
            });
        }
        catch (error) {
            this.logger.error(`Fail to fetch Confiabilidade with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async save(input: Omit<Confiabilidade, "Id">): Promise<Confiabilidade> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            this.logger.error(`Fail to save Confiabilidade`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async update(id: number, input: Partial<Confiabilidade>): Promise<Confiabilidade | null> {
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
            this.logger.error(`Fail to update Confiabilidade with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async remove(id: number): Promise<Confiabilidade | null> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.remove(record);
        }
        catch (error) {
            this.logger.error(`Fail to remove Confiabilidade with id: ${id}`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}