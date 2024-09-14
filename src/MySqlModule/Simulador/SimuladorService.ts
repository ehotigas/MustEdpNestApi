import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { GetSummaryFiltersDto } from "./Summary/dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorAdapter } from "./SimuladorAdapter";
import { GetSummaryDto } from "./Summary/dto/GetSummaryDto";
import { Providers } from "src/Providers";

export interface ISimuladorService {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<GetSimuladorDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto): Promise<GetSimuladorDto>;

    /**
     * @async
     * @returns {Promise<GetSimuladorDto>}
     * @throws {InternalServerErrorException}
     */
    generate(): Promise<GetSimuladorDto>;

    /**
     * @async
     * @returns {Promise<GetSimuladorDto>}
     * @throws {InternalServerErrorException}
     */
    removeAll(): Promise<GetSimuladorDto>;
}


@Injectable()
export class SimuladorService implements ISimuladorService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: ISimuladorAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("SimuladorService");
    }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<GetSimuladorDto> {
        this.logger.log(`Fetching all simulador data`);
        return {
            data: await this.adapter.findAll(filter)
        };
    }

    public async generate(): Promise<GetSimuladorDto> {
        this.logger.log(`Generating simulador data`);
        return {
            data: await this.adapter.generate()
        };
    }

    public async removeAll(): Promise<GetSimuladorDto> {
        this.logger.log(`Removing all simulador data`);
        return {
            data: await this.adapter.removeAll()
        };
    }
}