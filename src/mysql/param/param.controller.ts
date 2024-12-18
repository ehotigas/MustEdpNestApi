import { Body, Controller, Delete, Get, HttpStatus, Inject, Param as NestParam, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateManyParamResponseDto } from "./dto/create-many-param-response.dto";
import { CreateManyParamDto } from "./dto/create-many-param.dto";
import { GetFilterHeaderDto } from "./dto/get-filter-header.dto";
import { GetParamRequestDto } from "./dto/get-param-request.dto";
import { GetParamTableDto } from "./dto/get-param-table.dto";
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

    @Get("/table/:ponto")
    @ApiParam({ name: "ponto", type: String })
    @ApiQuery({ name: "ano", type: Number })
    @ApiQuery({ name: "cenario", type: String })
    @ApiResponse({ status: HttpStatus.OK, type: GetParamTableDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findParamTable(
        @NestParam("ponto") ponto: string,
        @Query("ano") ano: number,
        @Query("cenario") cenario: string
    ): Promise<GetParamTableDto> {
        return await this.service.findParamTable(ponto, ano, cenario);
    }

    @Get("/filter/header")
    @ApiResponse({ status: HttpStatus.OK, type: GetFilterHeaderDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async getFilterHeader(): Promise<GetFilterHeaderDto> {
        return await this.service.getFilterHeader();
    }

    @Post()
    @ApiBody({ type: CreateParamDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Param })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async save(@Body(new ValidationPipe()) input: CreateParamDto): Promise<Param> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyParamDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: CreateManyParamResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async saveMany(@Body(new ValidationPipe()) input: CreateManyParamDto): Promise<CreateManyParamResponseDto> {
        return await this.service.saveMany(input);
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