import { CreateManyConfiabilidadeDto } from "./dto/CreateManyConfiabilidadeDto";
import { CreateConfiabilidadeDto } from "./dto/CreateConfiabilidadeDto";
import { UpdateConfiabilidadeDto } from "./dto/UpdateConfiabilidadeDto";
import { GetConfiabilidadeDto } from "./dto/GetConfiabilidadeDto";
import { IConfiabilidadeService } from "./ConfiabilidadeService";
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


@Controller("/confiabilidade")
@ApiTags("Confiabilidade")
export class ConfiabilidadeController {
    public constructor(
        @Inject(Providers.CONFIABILIDADE_SERVICE)
        private readonly service: IConfiabilidadeService
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetConfiabilidadeDto> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Confiabilidade
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
    ): Promise<Confiabilidade> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateConfiabilidadeDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Confiabilidade
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateConfiabilidadeDto
    ): Promise<Confiabilidade> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyConfiabilidadeDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyConfiabilidadeDto
    ): Promise<GetConfiabilidadeDto> {
        return await this.service.saveMany(input);
    }

    @Patch("/:id")
    @ApiBody({ type: UpdateConfiabilidadeDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Confiabilidade
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
        @Body(new ValidationPipe()) input: UpdateConfiabilidadeDto
    ): Promise<Confiabilidade> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Confiabilidade
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
    ): Promise<Confiabilidade> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: 204,
        type: GetConfiabilidadeDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: NotFoundException
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async removeAll(): Promise<GetConfiabilidadeDto> {
        return await this.service.removeAll();
    }
}