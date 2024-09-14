import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { GetSummaryDto } from "./dto/GetSummaryDto";
import { ISummaryAdapter } from "./SummaryAdapter";
import { Providers } from "src/Providers";

export interface ISummaryService {
    /**
     * @async
     * @param {GetSummaryFiltersDto} filter
     * @returns {Promise<GetSummaryDto>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSummaryFiltersDto): Promise<GetSummaryDto>;
}

@Injectable()
export class SummaryService implements ISummaryService {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SUMMARY_ADAPTER)
        private readonly adapter: ISummaryAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("SummaryService");
    }

    public async findAll(filter: GetSummaryFiltersDto): Promise<GetSummaryDto> {
        this.logger.log(`Fetching all summary chart data`);
        return {
            summary: await this.adapter.findAll(filter)
        };
    }
}