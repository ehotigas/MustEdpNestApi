import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { IDemandaChartAdapter } from "./DemandaChartAdapter";
import { Providers } from "src/Providers";

export interface IDemandaChartService {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<GetDemandaChartDataDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto): Promise<GetDemandaChartDataDto>;
}

@Injectable()
export class DemandaChartService implements IDemandaChartService {
    private readonly logger: Logger
    public constructor(
        @Inject(Providers.DEMANDA_CHART_ADAPTER)
        private readonly adapter: IDemandaChartAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("DemandaChartService");
    }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<GetDemandaChartDataDto> {
        this.logger.log(`Fetching all demanda chart data`);
        return {
            data: await this.adapter.findAll(filter)
        };
    }
}