import { CreateManyTarifaDto } from "./dto/CreateManyTarifaDto";
import { TarifaServiceInterface } from "./TarifaService";
import { CreateTarifaDto } from "./dto/CreateTarifaDto";
import { UpdateTarifaDto } from "./dto/UpdateTarifaDto";
import { RequestError } from "src/types/RequestError";
import { GetTarifaDto } from "./dto/GetTarifaDto";
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
    Inject,
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
        private readonly service: TarifaServiceInterface
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: 200,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetTarifaDto | RequestError> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 200,
        type: Tarifa
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async get(
        @Param("id") id: number
    ): Promise<Tarifa | RequestError> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateTarifaDto })
    @ApiResponse({
        status: 201,
        type: Tarifa
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateTarifaDto
    ): Promise<Tarifa | RequestError> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyTarifaDto })
    @ApiResponse({
        status: 201,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyTarifaDto
    ): Promise<GetTarifaDto | RequestError> {
        return await this.service.saveMany(input);
    }


    @Patch("/:id")
    @ApiBody({ type: UpdateTarifaDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 201,
        type: Tarifa
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async patch(
        @Param("id") id: number,
        @Body(new ValidationPipe()) input: UpdateTarifaDto
    ): Promise<Tarifa | RequestError> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 204,
        type: Tarifa
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async delete(
        @Param("id") id: number
    ): Promise<Tarifa | RequestError> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: 204,
        type: GetTarifaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async removeAll(): Promise<GetTarifaDto | RequestError> {
        return await this.service.removeAll();
    }
}