import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyDemandaDto } from "./dto/CreateManyDemandaDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { CreateDemandaDto } from "./dto/CreateDemandaDto";
import { UpdateDemandaDto } from "./dto/UpdateDemandaDto";
import { GetDemandaDto } from "./dto/GetDemandaDto";
import { IDemandaAdapter } from "./DemandaAdapter";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Demanda } from "./Demanda";

export interface IDemandaService {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<GetDemandaDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<GetDemandaDto>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Demanda>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    find(id: number): Promise<Demanda>

    /**
     * @async
     * @param {CreateDemandaDto} input 
     * @returns {Promise<Demanda>}
     * @throws {InternalServerErrorException}
     */
    save(input: CreateDemandaDto): Promise<Demanda>

    /**
     * @async
     * @param {CreateManyDemandaDto} input 
     * @returns {Promise<GetDemandaDto>}
     * @throws {InternalServerErrorException}
     */
    saveMany(input: CreateManyDemandaDto): Promise<GetDemandaDto>

    /**
     * @async
     * @param {number} id 
     * @param {UpdateDemandaDto} input 
     * @returns {Promise<Demanda>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    update(id: number, input: UpdateDemandaDto): Promise<Demanda>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Demanda>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    remove(id: number): Promise<Demanda>

    /**
     * @async
     * @returns {Promise<GetDemandaDto>}
     * @throws {InternalServerErrorException}
     */
    removeAll(): Promise<GetDemandaDto>
}

@Injectable()
export class DemandaService implements IDemandaService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.DEMANDA_ADAPTER)
        private readonly adapter: IDemandaAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("DemandaService");
    }

    public async findAll(region: Region): Promise<GetDemandaDto> {
        this.logger.log(`Fetching all demanda`);
        return {
            demanda: await this.adapter.findAll(region)
        };
    }

    public async find(id: number): Promise<Demanda> {
        this.logger.log(`Fetching demanda with id: ${id}`);
        const demanda = await this.adapter.find(id);
        if (!demanda) {
            this.logger.warn(`Fail to fetch demanda with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to fetch demanda with id: ${id}. Not Found`);
        }
        return demanda;
    }

    public async save(input: CreateDemandaDto): Promise<Demanda> {
        this.logger.log(`Saving new demanda`);
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyDemandaDto): Promise<GetDemandaDto> {
        this.logger.log(`Saving many demanda`);
        const result = [];
        for (let index = 0; index < input.payload.length; index++) {
            const element = input.payload[index];
            const saveResult = await this.adapter.save(element);
            result.push(saveResult);
        }
        return {
            demanda: result
        };
    }

    public async update(id: number, input: UpdateDemandaDto): Promise<Demanda> {
        this.logger.log(`Updating demanda with id: ${id}`);
        const demanda = await this.adapter.update(id, input);
        if (!demanda) {
            this.logger.warn(`Fail to update demanda with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to update demanda with id: ${id}. Not Found`);
        }
        return demanda;
    }

    public async remove(id: number): Promise<Demanda> {
        this.logger.log(`Removing demanda with id: ${id}`);
        const demanda = await this.adapter.remove(id);
        if (!demanda) {
            this.logger.warn(`Fail to remove demanda with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to remove demanda with id: ${id}. Not Found`);
        }
        return demanda;
    }

    public async removeAll(): Promise<GetDemandaDto> {
        this.logger.log(`Removing all demanda`);
        const spLines = await this.adapter.findAll(Region.SP);
        const esLines = await this.adapter.findAll(Region.ES);

        const result = [];
        const lines = [...spLines, ...esLines];
        lines.forEach(async (element) => {
            const removeResult = await this.adapter.remove(element.Id);
            result.push(removeResult);
        });

        return {
            demanda: result
        };
    }
}