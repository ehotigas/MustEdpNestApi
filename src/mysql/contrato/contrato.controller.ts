import { Body, Controller, Delete, HttpStatus, Inject, Param, Patch, Post, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GenerateContractDto } from "./dto/generate-contract.dto";
import { CreateByDemandaDto } from "./dto/create-by-demanda.dto";
import { CreateContratoDto } from "./dto/create-contrato.dto";
import { UpdateContratoDto } from "./dto/update-contrato.dto";
import { RequestError } from "src/types/request-error";
import { IContratoService } from "./contrato.service";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";
import { CreateManyByDemandaDto } from "./dto/create-many-by-demanda.dto";
import { CreateManyByDemandaResponseDto } from "./dto/create-many-by-demanda-response.dto";


@Controller("/contrato")
@ApiTags("contrato-controller")
export class ContratoController {
    public constructor(
        @Inject(Providers.ContratoService)
        private readonly service: IContratoService
    ) {  }

    @Post("/generate/:year")
    @ApiParam({ name: "year", type: Number })
    @ApiResponse({ status: HttpStatus.CREATED, type: GenerateContractDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async generate(@Param("year") year: number): Promise<GenerateContractDto> {
        return await this.service.generate(year);
    }

    @Post()
    @ApiBody({ type: CreateContratoDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Contrato })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async save(@Body(new ValidationPipe()) input: CreateContratoDto): Promise<Contrato> {
        return await this.service.save(input);
    }

    @Post("/demanda")
    @ApiBody({ type: CreateByDemandaDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Contrato })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async saveByDemanda(@Body(new ValidationPipe()) input: CreateByDemandaDto): Promise<Contrato> {
        return await this.service.saveByDemanda(input);
    }

    @Post("/demanda/many")
    @ApiBody({ type: CreateManyByDemandaDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Contrato })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async saveManyByDemanda(@Body(new ValidationPipe()) input: CreateManyByDemandaDto): Promise<CreateManyByDemandaResponseDto> {
        return await this.service.saveManyByDemanda(input);
    }

    @Patch("/:id")
    @ApiParam({ name: "id", type: Number })
    @ApiBody({ type: UpdateContratoDto })
    @ApiResponse({ status: HttpStatus.OK, type: Contrato })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async update(@Param("id") id: number, @Body(new ValidationPipe()) input: UpdateContratoDto): Promise<Contrato> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({ name: "id", type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: Contrato })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: RequestError })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async remove(@Param("id") id: number): Promise<Contrato> {
        return await this.service.remove(id);
    }
}