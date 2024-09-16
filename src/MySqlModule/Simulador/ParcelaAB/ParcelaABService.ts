import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSummaryFiltersDto } from "../Summary/dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetParcelaABDto } from "./dto/GetParcelaABDto";
import { IParcelaABAdapter } from "./ParcelaABAdapter";
import { Providers } from "src/Providers";

export interface IParcelaABService {
    /**
     * @async
     * @param {GetSummaryFiltersDto} filter 
     * @returns {Promise<GetParcelaABDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSummaryFiltersDto): Promise<GetParcelaABDto>;
}

@Injectable()
export class ParcelaABService implements IParcelaABService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.PARCELAAB_ADAPTER)
        private readonly adapter: IParcelaABAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("ParcelaABService");
    }

    public async findAll(filter: GetSummaryFiltersDto): Promise<GetParcelaABDto> {
        this.logger.log(`Fetching all ParcelaAB data`);
        return {
            data: await this.adapter.findAll(filter)
        };
    }
}   