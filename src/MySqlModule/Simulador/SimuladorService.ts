import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetPenalidadeChartDataDto } from "./dto/GetPenalidadeChartDataDto";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorAdapter } from "./SimuladorAdapter";
import { Penalidade } from "src/types/Penalidade";
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
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<GetDemandaChartDataDto>}
     * @throws {InternalServerErrorException}
     */
    findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<GetDemandaChartDataDto>;

    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @param {Penalidade} penalidade
     * @returns {Promise<GetPenalidadeChartDataDto>}
     * @throws {InternalServerErrorException}
     */
    findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<GetPenalidadeChartDataDto>;

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

    public async findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<GetDemandaChartDataDto> {
        this.logger.log(`Fetching all demanda chart data`);
        return {
            data: await this.adapter.findDemandaChartData(filter)
        };
    }

    public async findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<GetPenalidadeChartDataDto> {
        this.logger.log(`Fetching all penalidade chart data`);
        return {
            data: await this.adapter.findPenalidadeChartData(filter, penalidade)
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