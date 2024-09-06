import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyTarifaDto } from "./dto/CreateManyTarifaDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { CreateTarifaDto } from "./dto/CreateTarifaDto";
import { UpdateTarifaDto } from "./dto/UpdateTarifaDto";
import { GetTarifaDto } from "./dto/GetTarifaDto";
import { ITarifaAdapter } from "./TarifaAdapter";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Tarifa } from "./Tarifa";

export interface ITarifaService {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<GetTarifaDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<GetTarifaDto>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    find(id: number): Promise<Tarifa>

    /**
     * @async
     * @param {CreateTarifaDto} input 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    save(input: CreateTarifaDto): Promise<Tarifa>

    /**
     * @async
     * @param {CreateManyTarifaDto} input 
     * @returns {Promise<GetTarifaDto>}
     * @throws {InternalServerErrorException}
     */
    saveMany(input: CreateManyTarifaDto): Promise<GetTarifaDto>

    /**
     * @async
     * @param {number} id 
     * @param {UpdateTarifaDto} input 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    update(id: number, input: UpdateTarifaDto): Promise<Tarifa>
    
    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    remove(id: number): Promise<Tarifa>

    /**
     * @async
     * @returns {Promise<Tarifa>}
     * @throws {InternalServerErrorException}
     */
    removeAll(): Promise<GetTarifaDto>
}

@Injectable()
export class TarifaService implements ITarifaService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.TARIFA_ADAPTER)
        private readonly adapter: ITarifaAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("TarifaService");
    }

    public async findAll(region: Region): Promise<GetTarifaDto> {
        this.logger.log(`Fetching all tarifas`);
        return {
            tarifa: await this.adapter.findAll(region)
        };
    }

    public async find(id: number): Promise<Tarifa> {
        this.logger.log(`Fetching tarifa with id: ${id}`);
        const tarifa = await this.adapter.find(id);
        if (!tarifa) {
            this.logger.warn(`Fail to fetch tarifa with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to fetch tarifa with id: ${id}. Not Found`);
        }
        return tarifa;
    }

    public async save(input: CreateTarifaDto): Promise<Tarifa> {
        this.logger.log(`Saving new tarifa`);
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyTarifaDto): Promise<GetTarifaDto> {
        this.logger.log(`Saving many tarifas`);
        const result = [];
        for (let index = 0; index < input.payload.length; index++) {
            const element = input.payload[index];
            const saveResult = await this.adapter.save(element);
            result.push(saveResult);
        }
        return {
            tarifa: result
        };
    }

    public async update(id: number, input: UpdateTarifaDto): Promise<Tarifa> {
        this.logger.log(`Updating tarifa with id: ${id}`);
        const tarifa = await this.adapter.update(id, input);
        if (!tarifa) {
            this.logger.warn(`Fail to update tarifa with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to update tarifa with id: ${id}. Not Found`);
        }
        return tarifa;
    }

    public async remove(id: number): Promise<Tarifa> {
        this.logger.log(`Removing tarifa with id: ${id}`);
        const tarifa = await this.adapter.remove(id);
        if (!tarifa) {
            this.logger.warn(`Fail to remove tarifa with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to remove tarifa with id: ${id}. Not Found`);
        }
        return tarifa;
    }

    public async removeAll(): Promise<GetTarifaDto> {
        this.logger.log(`Removing all tarifas`);
        const spLines = await this.adapter.findAll(Region.SP);
        const esLines = await this.adapter.findAll(Region.ES);

        const result = [];
        const lines = [...spLines, ...esLines];
        lines.forEach(async (element) => {
            const removeResult = await this.adapter.remove(element.Id);
            result.push(removeResult);
        });

        return {
            tarifa: result
        };
    }
}