import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";
import { GetSummaryDto } from "./dto/GetSummaryDto";
import { ISummaryService } from "./SummaryService";
import { Providers } from "src/Providers";
import {
    ApiBody,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    Body,
    Controller,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Post,
    ValidationPipe
} from "@nestjs/common";

@Controller("/summary")
@ApiTags("Summary")
export class SummaryController {
    public constructor(
        @Inject(Providers.SUMMARY_SERVICE)
        private readonly service: ISummaryService
    ) {  }

    @Post("/")
    @ApiBody({ type: GetSummaryFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetSummaryDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getSummaryChart(
        @Body(new ValidationPipe()) filter: GetSummaryFiltersDto
    ): Promise<GetSummaryDto> {
        return await this.service.findAll(filter);
    }
}

