import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyContratoDto } from "./dto/CreateManyContratoDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { CreateContratoDto } from "./dto/CreateContratoDto";
import { UpdateContratoDto } from "./dto/UpdateContratoDto";
import { GetContratoDto } from "./dto/GetContratoDto";
import { IContratoAdapter } from "./ContratoAdapter";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Contrato } from "./Contrato";

export interface IContratoService {
    /**
     * @async
     * @param {Region} region 
     * @returns {Promise<GetContratoDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(region: Region): Promise<GetContratoDto>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Contrato>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    find(id: number): Promise<Contrato>

    /**
     * @async
     * @param {CreateContratoDto} input 
     * @returns {Promise<Contrato>}
     * @throws {InternalServerErrorException}
     */
    save(input: CreateContratoDto): Promise<Contrato>

    /**
     * @async
     * @param {CreateManyContratoDto} input 
     * @returns {Promise<GetContratoDto>}
     * @throws {InternalServerErrorException}
     */
    saveMany: (input: CreateManyContratoDto) => Promise<GetContratoDto>

    /**
     * @async
     * @param {number} id 
     * @param {UpdateContratoDto} input 
     * @returns {Promise<Contrato>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    update(id: number, input: UpdateContratoDto): Promise<Contrato>

    /**
     * @async
     * @param {number} id 
     * @returns {Promise<Contrato>}
     * @throws {InternalServerErrorException}
     * @throws {NotFoundException}
     */
    remove(id: number): Promise<Contrato>

    /**
     * @async
     * @returns {Promise<GetContratoDto>}
     * @throws {InternalServerErrorException}
     */
    removeAll: () => Promise<GetContratoDto>
}

@Injectable()
export class ContratoService implements IContratoService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.CONTRATO_ADAPTER)
        private readonly adapter: IContratoAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("ContratoService");
    }

    public async findAll(region: Region): Promise<GetContratoDto> {
        this.logger.log(`Fetching all contratos`);
        return {
            contrato: await this.adapter.findAll(region)
        };
    }

    public async find(id: number): Promise<Contrato> {
        this.logger.log(`Fetching contrato with id: ${id}`);
        const contrato = await this.adapter.find(id);
        if (!contrato) {
            this.logger.warn(`Fail to fetch contrato with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to fetch contrato with id: ${id}. Not Found`);
        }
        return contrato;
    }

    public async save(input: CreateContratoDto): Promise<Contrato> {
        this.logger.log(`Saving all contratos`);
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyContratoDto): Promise<GetContratoDto> {
        this.logger.log(`Saving many contratos`);
        const result = [];
        for (let index = 0; index < input.payload.length; index++) {
            const element = input.payload[index];
            const saveResult = await this.adapter.save(element);
            result.push(saveResult);
        }
        return {
            contrato: result
        };
    }

    public async update(id: number, input: UpdateContratoDto): Promise<Contrato> {
        this.logger.log(`Updating contrato with id: ${id}`);
        const contrato = await this.adapter.update(id, input);
        if (!contrato) {
            this.logger.warn(`Fail to update contrato with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to update contrato with id: ${id}. Not Found`);
        }
        return contrato;
    }

    public async remove(id: number): Promise<Contrato> {
        this.logger.log(`Removing contrato with id: ${id}`);
        const contrato = await this.adapter.remove(id);
        if (!contrato) {
            this.logger.warn(`Fail to remove contrato with id: ${id}. Not Found`);
            throw new NotFoundException(`Fail to remove contrato with id: ${id}. Not Found`);
        }
        return contrato;
    }

    public async removeAll(): Promise<GetContratoDto> {
        this.logger.log(`Removing all contratos`);
        const spLines = await this.adapter.findAll(Region.SP);
        const esLines = await this.adapter.findAll(Region.ES);

        const result = [];
        const lines = [...spLines, ...esLines];
        lines.forEach(async (element) => {
            const removeResult = await this.adapter.remove(element.Id);
            result.push(removeResult);
        });

        return {
            contrato: result
        };
    }
}