import { Body, Controller, Inject, Post, Query, ValidationPipe } from "@nestjs/common";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SimuladorServiceInterface } from "./SimuladorService";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { RequestError } from "src/types/RequestError";
import { Providers } from "src/Providers";
import { Penalidade } from "src/types/Penalidade";
import { GetPenalidadeChartDataDto } from "./dto/GetPenalidadeChartDataDto";

@Controller("/simulador")
@ApiTags("Simulador")
export class SimuladorController {
    public constructor(
        @Inject(Providers.SIMULADOR_SERVICE)
        private readonly service: SimuladorServiceInterface
    ) {  }

    @Post("/")
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: 201,
        type: GetSimuladorDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getAll(
        @Body(new ValidationPipe()) input: GetSimuladorFiltersDto
    ): Promise<GetSimuladorDto | RequestError> {
        return await this.service.findAll(input);
    }

    @Post("/demanda-data")
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: 201,
        type: GetDemandaChartDataDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getDemandaChartData(
        @Body(new ValidationPipe()) input: GetSimuladorFiltersDto
    ): Promise<GetDemandaChartDataDto | RequestError> {
        return await this.service.findDemandaChartData(input);
    }

    @Post("/penalidade-data")
    @ApiQuery({
        type: String,
        enum: Penalidade
    })
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: 201,
        type: GetPenalidadeChartDataDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getPenalidadeChartData(
        @Body(new ValidationPipe()) filter: GetSimuladorFiltersDto,
        @Query("penalidade") penalidade: Penalidade
    ): Promise<GetPenalidadeChartDataDto | RequestError> {
        return this.service.findPenalidadeChartData(filter, penalidade);
    }
}