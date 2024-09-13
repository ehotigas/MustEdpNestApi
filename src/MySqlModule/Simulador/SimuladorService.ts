import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetDemandaChartDataDto } from "./DemandaChart/dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorAdapter } from "./SimuladorAdapter";
import { Providers } from "src/Providers";
import { GetSummaryDto } from "./dto/GetSummaryDto";

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

    /**
     * @async
     * @param {GetSummaryFiltersDto} filter
     * @returns {Promise<GetSummaryDto>}
     * @throws {InternalServerErrorException}
     */
    getSummaryChart(filter: GetSummaryFiltersDto): Promise<GetSummaryDto>;
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

    public async getSummaryChart(filter: GetSummaryFiltersDto): Promise<GetSummaryDto> {
        this.logger.log(`Fetching all summary chart data`);
        return {
            summary: await this.adapter.getSummaryChart(filter)
        };
    }
}