import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { IDemandaChartService } from "./DemandaChartService";
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

@Controller("/demanda-chart")
@ApiTags("Demanda Chart")
export class DemandaChartController {
    public constructor(
        @Inject(Providers.DEMANDA_CHART_SERVICE)
        private readonly service: IDemandaChartService
    ) {  }

    @Post("/")
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetDemandaChartDataDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getDemandaChartData(
        @Body(new ValidationPipe()) input: GetSimuladorFiltersDto
    ): Promise<GetDemandaChartDataDto> {
        return await this.service.findAll(input);
    }
}