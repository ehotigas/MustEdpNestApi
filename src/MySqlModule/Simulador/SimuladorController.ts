import { Body, Controller, Delete, HttpStatus, Inject, InternalServerErrorException, Post, Query, ValidationPipe } from "@nestjs/common";
import { GetPenalidadeChartDataDto } from "./dto/GetPenalidadeChartDataDto";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorService } from "./SimuladorService";
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

    @Post("/penalidade-data")
    @ApiQuery({
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
        return this.service.findPenalidadeChartData(filter, penalidade);
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
}