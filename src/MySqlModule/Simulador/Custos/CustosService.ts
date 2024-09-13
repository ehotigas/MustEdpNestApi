import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetPenalidadeChartDataDto } from "./dto/GetCustosChartDataDto";
import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { Penalidade } from "src/types/Penalidade";
import { ICustosAdapter } from "./CustosAdapter";
import { Providers } from "src/Providers";

export interface ICustosService {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @param {Penalidade} penalidade
     * @returns {Promise<GetPenalidadeChartDataDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<GetPenalidadeChartDataDto>;
}

@Injectable()
export class CustosService implements ICustosService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.CUSTOS_ADAPTER)
        private readonly adapter: ICustosAdapter,
        @Inject(Providers.LOGGER_FACTORY)        
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosService")
    }


    public async findAll(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<GetPenalidadeChartDataDto> {
        this.logger.log(`Fetching all penalidade chart data`);
        return {
            data: await this.adapter.findAll(filter, penalidade)
        };
    }
}