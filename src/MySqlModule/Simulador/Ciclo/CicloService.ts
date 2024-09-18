import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSummaryFiltersDto } from "../Summary/dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetCicloDto } from "./dto/GetCicloDto";
import { ICicloAdapter } from "./CicloAdapter";
import { Providers } from "src/Providers";

export interface ICicloService {
    /**
     * @async
     * @param {GetSummaryFiltersDto} filter 
     * @returns {Promise<GetCicloDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSummaryFiltersDto): Promise<GetCicloDto>;
}

@Injectable()
export class CicloService implements ICicloService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.CICLO_ADAPTER)
        private readonly adapter: ICicloAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosAdapter");
    }

    public async findAll(filter: GetSummaryFiltersDto): Promise<GetCicloDto> {
        this.logger.log("Fetching all Ciclo data");
        return {
            data: await this.adapter.findAll(filter)
        };
    }
}