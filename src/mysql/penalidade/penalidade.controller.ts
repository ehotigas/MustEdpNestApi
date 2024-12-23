import { Controller, Get, HttpStatus, Inject, Param, Query } from "@nestjs/common";
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPenalidadeTableDto } from "./dto/get-penalidade-table.dto";
import { IPenalidadeService } from "./penalidade.service";
import { RequestError } from "src/types/request-error";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";
import { Region } from "src/types/region";


@Controller("/penalidade")
@ApiTags("penalidade-controller")
export class PenalidadeController {
    public constructor(
        @Inject(Providers.PenalidadeService)
        private readonly service: IPenalidadeService
    ) {  }
    
    @Get("/:year")
    @ApiParam({ name: "year", type: Number })
    @ApiQuery({ name: "region", type: String, enum: Region })
    @ApiResponse({ status: HttpStatus.OK, type: GetPenalidadeTableDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findPenalidadeTable(@Param("year") year: number, @Query("region") region: Region): Promise<GetPenalidadeTableDto> {
        return await this.service.findPenalidadeTable(year, region);
    }

    @Get("/chart/:year")
    @ApiParam({ name: "year", type: Number })
    @ApiQuery({ name: "region", type: String, enum: Region })
    @ApiQuery({ name: "ponto", type: String })
    @ApiQuery({ name: "posto", type: String, enum: Posto })
    @ApiQuery({ name: "contrato", type: String })
    @ApiQuery({ name: "demanda", type: String })
    @ApiResponse({ status: HttpStatus.OK, type: GetPenalidadeTableDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findPenalidadeChat(
        @Param("year") year: number,
        @Query("ponto") ponto: string,
        @Query("posto") posto: Posto,
        @Query("contrato") contrato: string,
        @Query("demanda") demanda: string,
        @Query("region") region: Region
    ): Promise<GetPenalidadeTableDto> {
        return await this.service.findPenalidadeChat(year, ponto, posto, contrato, demanda, region);
    }
}