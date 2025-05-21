import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePontoDto } from "./dto/create-ponto.dto";
import { UpdatePontoDto } from "./dto/update-ponto.dto";
import { RequestError } from "src/types/request-error";
import { GetPontoDto } from "./dto/get-ponto.dto";
import { IPontoService } from "./ponto.service";
import { Providers } from "src/providers";
import { Region } from "src/types/region";
import { Ponto } from "./ponto.entity";


@Controller("/ponto")
@ApiTags("ponto-controller")
export class PontoController {
    public constructor(
        @Inject(Providers.PontoService)
        private readonly service: IPontoService
    ) {  }

    @Get()
    @ApiQuery({ name: "id", type: String, required: false })
    @ApiQuery({ name: "nome", type: String, required: false })
    @ApiQuery({ name: "empresa", enum: Region, required: false })
    @ApiResponse({ status: HttpStatus.OK, type: GetPontoDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findAll(
        @Query("id") id?: string,
        @Query("nome") nome?: string,
        @Query("empresa") empresa?: Region
    ): Promise<GetPontoDto> {
        return await this.service.findAll(id, nome, empresa);
    }

    @Get("/:id")
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: HttpStatus.OK, type: Ponto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findById(@Param("id") id: string): Promise<Ponto> {
        return await this.service.findById(id);
    }

    @Get("/name/:name")
    @ApiParam({ name: "name", type: String })
    @ApiResponse({ status: HttpStatus.OK, type: Ponto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findByName(@Param("name") name: string): Promise<Ponto> {
        return await this.service.findByName(name);
    }

    @Post()
    @ApiBody({ type: CreatePontoDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Ponto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async save(@Body(new ValidationPipe()) input: CreatePontoDto): Promise<Ponto> {
        return await this.service.save(input);
    }

    @Patch("/:id")
    @ApiParam({ name: "id", type: String })
    @ApiBody({ type: UpdatePontoDto })
    @ApiResponse({ status: HttpStatus.OK, type: Ponto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async update(@Param("id") id: string, @Body(new ValidationPipe()) input: UpdatePontoDto): Promise<Ponto> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: HttpStatus.OK, type: Ponto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async remove(@Param("id") id: string): Promise<Ponto> {
        return await this.service.remove(id);
    }
}