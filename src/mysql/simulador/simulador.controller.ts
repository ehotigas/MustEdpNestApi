import { Controller, Get, HttpStatus, Inject, Param, Query } from "@nestjs/common";
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSimuladorDataDto } from "./dto/get-simulador-data.dto";
import { ISimuladorService } from "./simulador.service";
import { RequestError } from "src/types/request-error";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";


@Controller("/simulador")
@ApiTags("Simulador")
export class SimuladorController {
    public constructor(
        @Inject(Providers.SimuladorService)
        private readonly service: ISimuladorService
    ) {  }

    @Get("/:year")
    @ApiParam({ name: "year", type: Number })
    @ApiQuery({ name: "region", type: String, enum: Region })
    @ApiResponse({ status: HttpStatus.OK, type: GetSimuladorDataDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findData(@Param("year") year: number, @Query("region") region: Region): Promise<GetSimuladorDataDto> {
        return await this.service.findData(year, region);
    }
}