import { Controller, Get, HttpStatus, Inject, Param } from "@nestjs/common";
import { GetSimuladorDataDto } from "./dto/get-simulador-data.dto";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ISimuladorService } from "./simulador.service";
import { RequestError } from "src/types/request-error";
import { Providers } from "src/Providers";


@Controller("/simulador")
@ApiTags("Simulador")
export class SimuladorController {
    public constructor(
        @Inject(Providers.SimuladorService)
        private readonly service: ISimuladorService
    ) {  }

    @Get("/:year")
    @ApiParam({ name: "year", type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: GetSimuladorDataDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findData(@Param("year") year: number): Promise<GetSimuladorDataDto> {
        return await this.service.findData(year);
    }
}