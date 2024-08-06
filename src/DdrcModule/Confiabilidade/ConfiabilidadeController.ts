import { CreateManyConfiabilidadeDto } from "./dto/CreateManyConfiabilidadeDto";
import { ConfiabilidadeServiceInterface } from "./ConfiabilidadeService";
import { CreateConfiabilidadeDto } from "./dto/CreateConfiabilidadeDto";
import { UpdateConfiabilidadeDto } from "./dto/UpdateConfiabilidadeDto";
import { GetConfiabilidadeDto } from "./dto/GetConfiabilidadeDto";
import { RequestError } from "src/types/RequestError";
import { Confiabilidade } from "./Confiabilidade";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
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

@Controller("/confiabilidade")
@ApiTags("Confiabilidade")
export class ConfiabilidadeController {
    public constructor(
        @Inject(Providers.CONFIABILIDADE_SERVICE)
        private readonly service: ConfiabilidadeServiceInterface
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: 200,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetConfiabilidadeDto | RequestError> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 200,
        type: Confiabilidade
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async get(
        @Param("id") id: number
    ): Promise<Confiabilidade | RequestError> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateConfiabilidadeDto })
    @ApiResponse({
        status: 201,
        type: Confiabilidade
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateConfiabilidadeDto
    ): Promise<Confiabilidade | RequestError> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyConfiabilidadeDto })
    @ApiResponse({
        status: 201,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyConfiabilidadeDto
    ): Promise<GetConfiabilidadeDto | RequestError> {
        return await this.service.saveMany(input);
    }

    @Patch("/:id")
    @ApiBody({ type: UpdateConfiabilidadeDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 201,
        type: Confiabilidade
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async patch(
        @Param("id") id: number,
        @Body(new ValidationPipe()) input: UpdateConfiabilidadeDto
    ): Promise<Confiabilidade | RequestError> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 204,
        type: Confiabilidade
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async delete(
        @Param("id") id: number
    ): Promise<Confiabilidade | RequestError> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: 204,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async removeAll(): Promise<GetConfiabilidadeDto | RequestError> {
        return await this.service.removeAll();
    }
}