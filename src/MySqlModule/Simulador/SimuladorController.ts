import { Body, Controller, Delete, HttpStatus, Inject, InternalServerErrorException, Post, ValidationPipe } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { ISimuladorService } from "./SimuladorService";
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