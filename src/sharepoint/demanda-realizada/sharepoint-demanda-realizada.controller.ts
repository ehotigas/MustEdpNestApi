import { UpdateDemandaRealizadaDto } from "./dto/update-demanda-realizada.dto";
import { ISharepointDemandaRealizadaService } from "./sharepoint-demanda-realizada.service";
import { SharepointDemandaTableDto } from "./dto/sharepoint-demanda-table.dto";
import { Controller, Get, HttpStatus, Inject } from "@nestjs/common";
import { RequestError } from "src/types/request-error";
import { ApiResponse } from "@nestjs/swagger";
import { Providers } from "src/Providers";


@Controller("/sharepoint-demanda-realizada")
export class SharepointDemandaRealizadaController {
    public constructor(@Inject(Providers.SharepointDemandaRealizadaService) private readonly service: ISharepointDemandaRealizadaService) {  }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [SharepointDemandaTableDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(): Promise<SharepointDemandaTableDto[]> {
        return await this.service.findAll();
    }

    @Get("/update")
    @ApiResponse({ status: HttpStatus.OK, type: [UpdateDemandaRealizadaDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async updateAll(): Promise<UpdateDemandaRealizadaDto> {
        return await this.service.updateAll();
    }
}