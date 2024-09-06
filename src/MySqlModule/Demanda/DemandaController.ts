import { CreateManyDemandaDto } from "./dto/CreateManyDemandaDto";
import { CreateDemandaDto } from "./dto/CreateDemandaDto";
import { UpdateDemandaDto } from "./dto/UpdateDemandaDto";
import { GetDemandaDto } from "./dto/GetDemandaDto";
import { IDemandaService } from "./DemandaService";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Demanda } from "./Demanda";
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

@Controller("/demanda")
@ApiTags("Demanda")
export class DemandaController {
    public constructor(
        @Inject(Providers.DEMANDA_SERVICE)
        private readonly service: IDemandaService
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetDemandaDto> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Demanda
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
    ): Promise<Demanda> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateDemandaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Demanda
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateDemandaDto
    ): Promise<Demanda> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyDemandaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyDemandaDto
    ): Promise<GetDemandaDto> {
        return await this.service.saveMany(input);
    }


    @Patch("/:id")
    @ApiBody({ type: UpdateDemandaDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Demanda
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
        @Body(new ValidationPipe()) input: UpdateDemandaDto
    ): Promise<Demanda> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: Demanda
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
    ): Promise<Demanda> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async removeAll(): Promise<GetDemandaDto> {
        return await this.service.removeAll();
    }
}