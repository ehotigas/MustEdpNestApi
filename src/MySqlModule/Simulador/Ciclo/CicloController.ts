import { GetSummaryFiltersDto } from "../Summary/dto/GetSummaryFiltersDto";
import { GetCicloDto } from "./dto/GetCicloDto";
import { ICicloService } from "./CicloService";
import { Providers } from "src/Providers";
import {
    ApiBody,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    Body,
    Controller,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Post,
    ValidationPipe
} from "@nestjs/common";

@Controller("/ciclo")
@ApiTags("Ciclo")
export class CicloController {
    public constructor(
        @Inject(Providers.CICLO_SERVICE)
        private readonly service: ICicloService
    ) {  }


    @Post("/")
    @ApiBody({ type: GetSummaryFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetCicloDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async findAll(
        @Body(new ValidationPipe()) filter: GetSummaryFiltersDto
    ): Promise<GetCicloDto> {
        return await this.service.findAll(filter);
    }
}