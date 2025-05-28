import { ISharepointParamService } from "./sharepoint-param.service";
import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { Controller, Get, HttpStatus, Inject } from "@nestjs/common";
import { UpdateParamDto } from "./dto/update-param.dto";
import { RequestError } from "src/types/request-error";
import { ApiResponse } from "@nestjs/swagger";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";


@Controller("/sharepoint-param")
export class SharepointParamController {
    public constructor(@Inject(Providers.SharepointParamService) private readonly service: ISharepointParamService) {  }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [CreateParamDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(): Promise<CreateParamDto[]> {
        return await this.service.findAll();
    }

    @Get("/update")
    @ApiResponse({ status: HttpStatus.OK, type: [CreateParamDto] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async updateAll(region: Region): Promise<UpdateParamDto> {
        return await this.service.updateAll();
    }
}