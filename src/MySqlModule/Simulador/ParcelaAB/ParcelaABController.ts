import { GetSummaryFiltersDto } from "../Summary/dto/GetSummaryFiltersDto";
import { GetParcelaABDto } from "./dto/GetParcelaABDto";
import { IParcelaABService } from "./ParcelaABService";
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

@Controller("/parcelaab")
@ApiTags("Parcela AB")
export class ParcelaABController {
    public constructor(
        @Inject(Providers.PARCELAAB_SERVICE)
        private readonly service: IParcelaABService
    ) {  }

    @Post("/")
    @ApiBody({ type: GetSummaryFiltersDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetParcelaABDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorException
    })
    public async getAll(
        @Body(new ValidationPipe()) filter: GetSummaryFiltersDto
    ): Promise<GetParcelaABDto> {
        return await this.service.findAll(filter);
    }
}