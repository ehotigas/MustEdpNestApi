import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyConfiabilidadeDto } from "./dto/CreateManyConfiabilidadeDto";
import { ConfiabilidadeAdapterInterface } from "./ConfiabilidadeAdapter";
import { CreateConfiabilidadeDto } from "./dto/CreateConfiabilidadeDto";
import { UpdateConfiabilidadeDto } from "./dto/UpdateConfiabilidadeDto";
import { GetConfiabilidadeDto } from "./dto/GetConfiabilidadeDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { Confiabilidade } from "./Confiabilidade";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";

export interface ConfiabilidadeServiceInterface {
    /**
     * @async
     * @param {Region} region
     * @returns {Promise<GetConfiabilidadeDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<GetConfiabilidadeDto>

    /**
     * @async
     * @param {number} id
     * @returns {Promise<Confiabilidade>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    find(id: number): Promise<Confiabilidade>

    /**
     * @async
     * @param {CreateConfiabilidadeDto} input
     * @returns {Promise<Confiabilidade>}
     * @throws {InternalServerErrorException}
     */
    save(input: CreateConfiabilidadeDto): Promise<Confiabilidade>

    /**
     * @async
     * @param {CreateConfiabilidadeDto} input
     * @returns {Promise<GetConfiabilidadeDto>}
     * @throws {InternalServerErrorException}
     */
    saveMany(input: CreateManyConfiabilidadeDto): Promise<GetConfiabilidadeDto>

    /**
     * @async
     * @param {number} id
     * @param {UpdateConfiabilidadeDto} input
     * @returns {Promise<Confiabilidade>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    update(id: number, input: UpdateConfiabilidadeDto): Promise<Confiabilidade>

    /**
     * @async
     * @param {number} id
     * @returns {Promise<Confiabilidade>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    remove(id: number): Promise<Confiabilidade>

    /**
     * @async
     * @returns {Promise<GetConfiabilidadeDto>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    removeAll(): Promise<GetConfiabilidadeDto>
}

@Injectable()
export class ConfiabilidadeService implements ConfiabilidadeServiceInterface {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.CONFIABILIDADE_ADAPTER)
        private readonly adapter: ConfiabilidadeAdapterInterface,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("ConfiabilidadeService");
    }

    public async findAll(region: Region): Promise<GetConfiabilidadeDto> {
        this.logger.log("Fetching all Confiabilidade");
        return {
            confiabilidade: await this.adapter.findAll(region)
        };
    }

    public async find(id: number): Promise<Confiabilidade> {
        this.logger.log(`Fetching Confiabilidade with id: ${id}`);
        const confiabilidade = await this.adapter.find(id);
        if (!confiabilidade) {
            this.logger.warn(`Fail to fetch Confiabilidade with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to fetch Confiabilidade with id: ${id}. Not Found`);
        }
        return confiabilidade;
    }

    public async save(input: CreateConfiabilidadeDto): Promise<Confiabilidade> {
        this.logger.log(`Saving new Confiabilidade`);
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyConfiabilidadeDto): Promise<GetConfiabilidadeDto> {
        this.logger.log(`Saving many Confiabilidade`);
        const result = [];
        for (let index = 0; index < input.payload.length; index++) {
            const element = input.payload[index];
            const saveResult = await this.adapter.save(element);
            result.push(saveResult);
        }
        return {
            confiabilidade: result
        };
    }

    public async update(id: number, input: UpdateConfiabilidadeDto): Promise<Confiabilidade> {
        this.logger.log(`Updating Confiabilidade with id: ${id}`);
        const confiabilidade = await this.adapter.update(id, input);
        if (!confiabilidade) {
            this.logger.warn(`Fail to update Confiabilidade with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to update Confiabilidade with id: ${id}. Not Found`);
        }
        return confiabilidade;
    }

    public async remove(id: number): Promise<Confiabilidade> {
        this.logger.log(`Removing Confiabilidade with id: ${id}`);
        const confiabilidade = await this.adapter.remove(id);
        if (!confiabilidade) {
            this.logger.warn(`Fail to remove Confiabilidade with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to remove Confiabilidade with id: ${id}. Not Found`);
        }
        return confiabilidade;
    }

    public async removeAll(): Promise<GetConfiabilidadeDto> {
        this.logger.log(`Removing all Confiabilidade`);
        const spLines = await this.adapter.findAll(Region.SP);
        const esLines = await this.adapter.findAll(Region.ES);

        const result = [];
        const lines = [...spLines, ...esLines];
        lines.forEach(async (element) => {
            const removeResult = await this.adapter.remove(element);
            result.push(removeResult);
        });

        return {
            confiabilidade: result
        };
    }
}