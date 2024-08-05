import { CreateManyContratoDto } from "./dto/CreateManyContratoDto";
import { ContratoServiceInterface } from "./ContratoService";
import { CreateContratoDto } from "./dto/CreateContratoDto";
import { UpdateContratoDto } from "./dto/UpdateContratoDto";
import { RequestError } from "src/types/RequestError";
import { GetContratoDto } from "./dto/GetContratoDto";
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
    Inject,
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
        private readonly service: ContratoServiceInterface
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: 200,
        type: GetContratoDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
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
        status: 200,
        type: Contrato
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async get(
        @Param("id") id: number
    ): Promise<Contrato | RequestError> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateContratoDto })
    @ApiResponse({
        status: 201,
        type: Contrato
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateContratoDto
    ): Promise<Contrato | RequestError> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyContratoDto })
    @ApiResponse({
        status: 201,
        type: GetContratoDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
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
        status: 201,
        type: Contrato
    })
    @ApiResponse({
        status: 500,
        type: RequestError
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
        status: 204,
        type: Contrato
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async delete(
        @Param("id") id: number
    ): Promise<Contrato | RequestError> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: 204,
        type: GetContratoDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async removeAll(): Promise<GetContratoDto | RequestError> {
        return await this.service.removeAll();
    }
}