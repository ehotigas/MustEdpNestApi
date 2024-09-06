import { CreateManyContratoDto } from "./dto/CreateManyContratoDto";
import { CreateContratoDto } from "./dto/CreateContratoDto";
import { UpdateContratoDto } from "./dto/UpdateContratoDto";
import { RequestError } from "src/types/RequestError";
import { GetContratoDto } from "./dto/GetContratoDto";
import { IContratoService } from "./ContratoService";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Contrato } from "./Contrato";
import {
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    ValidationPipe
} from "@nestjs/common";

@Controller("/contrato")
@ApiTags("Contrato")
export class ContratoController {
    public constructor(
        @Inject(Providers.CONTRATO_SERVICE)
        private readonly service: IContratoService
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetContratoDto | RequestError> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: NotFoundException
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async get(
        @Param("id") id: number
    ): Promise<Contrato | RequestError> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateContratoDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Contrato
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateContratoDto
    ): Promise<Contrato | RequestError> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyContratoDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyContratoDto
    ): Promise<GetContratoDto | RequestError> {
        return await this.service.saveMany(input);
    }


    @Patch("/:id")
    @ApiBody({ type: UpdateContratoDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: NotFoundException
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async patch(
        @Param("id") id: number,
        @Body(new ValidationPipe()) input: UpdateContratoDto
    ): Promise<Contrato | RequestError> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: NotFoundException
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async delete(
        @Param("id") id: number
    ): Promise<Contrato | RequestError> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetContratoDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async removeAll(): Promise<GetContratoDto | RequestError> {
        return await this.service.removeAll();
    }
}