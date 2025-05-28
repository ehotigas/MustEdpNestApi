import { ISharepointDemandaService } from "./sharepoint-demanda.service";
import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { Controller, Get, HttpStatus, Inject } from "@nestjs/common";
import { RequestError } from "src/types/request-error";
import { ApiResponse } from "@nestjs/swagger";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";
import { UpdateDemandaDto } from "./dto/update-demanda.dto";


@Controller("/sharepoint-demanda")
export class SharepointDemandaController {
    public constructor(@Inject(Providers.SharepointDemandaService) private readonly service: ISharepointDemandaService) {  }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [CreateParamDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(): Promise<CreateParamDto[]> {
        return await this.service.findAll();
    }

    @Get("/update")
    @ApiResponse({ status: HttpStatus.OK, type: [CreateParamDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async updateAll(region: Region): Promise<UpdateDemandaDto> {
        return await this.service.updateAll();
    }
}