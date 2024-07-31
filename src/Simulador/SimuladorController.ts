import { Body, Controller, Inject, Post, ValidationPipe } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { SimuladorServiceInterface } from "./SimuladorService";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { RequestError } from "src/types/RequestError";
import { Providers } from "src/Providers";

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
}