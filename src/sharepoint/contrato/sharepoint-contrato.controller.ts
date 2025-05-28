import { CreateByDemandaDto } from "src/mysql/contrato/dto/create-by-demanda.dto";
import { ISharepointContratoService } from "./sharepoint-contrato.service";
import { Controller, Get, HttpStatus, Inject } from "@nestjs/common";
import { UpdateContratoDto } from "./dto/update-contrato.dto";
import { RequestError } from "src/types/request-error";
import { ApiResponse } from "@nestjs/swagger";
import { Providers } from "src/Providers";


@Controller("/sharepoint-contrato")
export class SharepointContratoController {
    public constructor(@Inject(Providers.SharepointContratoService) private readonly service: ISharepointContratoService) {  }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [CreateByDemandaDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(): Promise<CreateByDemandaDto[]> {
        return await this.service.findAll();
    }

    @Get("/update")
    @ApiResponse({ status: HttpStatus.OK, type: [UpdateContratoDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async updateAll(): Promise<UpdateContratoDto> {
        return await this.service.updateAll();
    }
}