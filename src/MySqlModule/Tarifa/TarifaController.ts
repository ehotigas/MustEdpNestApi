import { CreateManyTarifaDto } from "./dto/CreateManyTarifaDto";
import { CreateTarifaDto } from "./dto/CreateTarifaDto";
import { UpdateTarifaDto } from "./dto/UpdateTarifaDto";
import { GetTarifaDto } from "./dto/GetTarifaDto";
import { ITarifaService } from "./TarifaService";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Tarifa } from "./Tarifa";
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

@Controller("/tarifa")
@ApiTags("Tarifa")
export class TarifaController {
    public constructor(
        @Inject(Providers.TARIFA_SERVICE)
        private readonly service: ITarifaService
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetTarifaDto> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Tarifa
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
    ): Promise<Tarifa> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateTarifaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Tarifa
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateTarifaDto
    ): Promise<Tarifa> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyTarifaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyTarifaDto
    ): Promise<GetTarifaDto> {
        return await this.service.saveMany(input);
    }


    @Patch("/:id")
    @ApiBody({ type: UpdateTarifaDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Tarifa
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
        @Body(new ValidationPipe()) input: UpdateTarifaDto
    ): Promise<Tarifa> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Tarifa
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
    ): Promise<Tarifa> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async removeAll(): Promise<GetTarifaDto> {
        return await this.service.removeAll();
    }
}