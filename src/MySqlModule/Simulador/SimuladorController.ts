import { Body, Controller, Delete, HttpStatus, Inject, InternalServerErrorException, Post, Query, ValidationPipe } from "@nestjs/common";
import { GetPenalidadeChartDataDto } from "./Custos/dto/GetCustosChartDataDto";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDemandaChartDataDto } from "./DemandaChart/dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./Custos/dto/GetSimuladorFiltersDto";
import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorService } from "./SimuladorService";
import { GetSummaryDto } from "./dto/GetSummaryDto";
import { Penalidade } from "src/types/Penalidade";
import { Providers } from "src/Providers";

@Controller("/simulador")
@ApiTags("Simulador")
export class SimuladorController {
    public constructor(
        @Inject(Providers.SIMULADOR_SERVICE)
        private readonly service: ISimuladorService
    ) {  }

    @Post("/")
    @ApiBody({ type: GetSimuladorFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetSimuladorDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Body(new ValidationPipe()) input: GetSimuladorFiltersDto
    ): Promise<GetSimuladorDto> {
        return await this.service.findAll(input);
    }

    @Post("/demanda-data")
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
        return await this.service.findDemandaChartData(input);
    }

    @Post("/generate")
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetSimuladorDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async generate(): Promise<GetSimuladorDto> {
        return await this.service.generate();
    }

    @Delete("/")
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetSimuladorDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async deleteAll(): Promise<GetSimuladorDto> {
        return await this.service.removeAll();
    }

    @Post("/summary")
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
        return await this.service.getSummaryChart(filter);
    }
}