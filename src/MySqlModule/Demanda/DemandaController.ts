import { CreateManyDemandaDto } from "./dto/CreateManyDemandaDto";
import { DemandaServiceInterface } from "./DemandaService";
import { CreateDemandaDto } from "./dto/CreateDemandaDto";
import { UpdateDemandaDto } from "./dto/UpdateDemandaDto";
import { RequestError } from "src/types/RequestError";
import { GetDemandaDto } from "./dto/GetDemandaDto";
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
    Inject,
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
        private readonly service: DemandaServiceInterface
    ) {  }

    @Get("/")
    @ApiQuery({
        name: "region",
        enum: Region
    })
    @ApiResponse({
        status: 200,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async getAll(
        @Query("region") region: Region
    ): Promise<GetDemandaDto | RequestError> {
        return await this.service.findAll(region);
    }

    @Get("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 200,
        type: Demanda
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async get(
        @Param("id") id: number
    ): Promise<Demanda | RequestError> {
        return await this.service.find(id);
    }

    @Post("/")
    @ApiBody({ type: CreateDemandaDto })
    @ApiResponse({
        status: 201,
        type: Demanda
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async create(
        @Body(new ValidationPipe()) input: CreateDemandaDto
    ): Promise<Demanda | RequestError> {
        return await this.service.save(input);
    }

    @Post("/many")
    @ApiBody({ type: CreateManyDemandaDto })
    @ApiResponse({
        status: 201,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async createMany(
        @Body(new ValidationPipe()) input: CreateManyDemandaDto
    ): Promise<GetDemandaDto | RequestError> {
        return await this.service.saveMany(input);
    }


    @Patch("/:id")
    @ApiBody({ type: UpdateDemandaDto })
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 201,
        type: Demanda
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async patch(
        @Param("id") id: number,
        @Body(new ValidationPipe()) input: UpdateDemandaDto
    ): Promise<Demanda | RequestError> {
        return await this.service.update(id, input);
    }

    @Delete("/:id")
    @ApiParam({
        name: "id",
        type: Number
    })
    @ApiResponse({
        status: 204,
        type: Demanda
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async delete(
        @Param("id") id: number
    ): Promise<Demanda | RequestError> {
        return await this.service.remove(id);
    }

    @Delete("/delete/all")
    @ApiResponse({
        status: 204,
        type: GetDemandaDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async removeAll(): Promise<GetDemandaDto | RequestError> {
        return await this.service.removeAll();
    }
}