import { GetPenalidadeChartDataDto } from "./dto/GetCustosChartDataDto";
import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { Penalidade } from "src/types/Penalidade";
import { ICustosService } from "./CustosService";
import { Providers } from "src/Providers";
import {
    ApiBody,
    ApiQuery,
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
    Query,
    ValidationPipe
} from "@nestjs/common";

@Controller("/custo")
@ApiTags("Custos")
export class CustosController {
    public constructor(
        @Inject(Providers.CUSTOS_SERVICE)
        private readonly service: ICustosService
    ) {  }

    @Post("/")
    @ApiQuery({
        name: "penalidade",
        type: String,
        enum: Penalidade
    })
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetPenalidadeChartDataDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getPenalidadeChartData(
        @Body(new ValidationPipe()) filter: GetSimuladorFiltersDto,
        @Query("penalidade") penalidade: Penalidade
    ): Promise<GetPenalidadeChartDataDto> {
        return this.service.findAll(filter, penalidade);
    }
}