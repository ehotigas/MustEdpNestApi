import { Body, Controller, Delete, Get, HttpStatus, Inject, Param as NestParam, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetParamRequestDto } from "./dto/get-param-request.dto";
import { CreateParamDto } from "./dto/create-param.dto";
import { UpdateParamDto } from "./dto/update-param.dto";
import { RequestError } from "src/types/request-error";
import { GetParamDto } from "./dto/get-param.dto";
import { IParamService } from "./param.service";
import { Providers } from "src/providers";
import { Param } from "./param.entity";


@Controller("/param")
@ApiTags("param-controller")
export class ParamController {
    public constructor(
        @Inject(Providers.ParamService)
        private readonly service: IParamService
    ) {  }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: GetParamDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(@Query(new ValidationPipe()) filters: GetParamRequestDto): Promise<GetParamDto> {
        return await this.service.findAll(filters);
    }

    @Get("/:id")
    @ApiParam({ name: "id", type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: Param })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findById(@NestParam("id") id: number): Promise<Param> {
        return await this.service.findById(id);
    }

    @Post()
    @ApiBody({ type: CreateParamDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Param })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async save(@Body(new ValidationPipe()) input: CreateParamDto): Promise<Param> {
        return await this.service.save(input);
    }

    @Patch("/:id")
    @ApiParam({ name: "id", type: Number })
    @ApiBody({ type: UpdateParamDto })
    @ApiResponse({ status: HttpStatus.OK, type: Param })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async update(@NestParam("id") id: number, @Body(new ValidationPipe()) input: UpdateParamDto): Promise<Param> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({ name: "id", type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: Param })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async remove(@NestParam("id") id: number): Promise<Param> {
        return await this.service.remove(id);
    }

}