import { GetPenalidadeTableDto } from "./dto/get-penalidade-table.dto";
import { Controller, Get, HttpStatus, Inject } from "@nestjs/common";
import { IPenalidadeService } from "./penalidade.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequestError } from "src/types/request-error";
import { Providers } from "src/Providers";


@Controller("/penalidade")
@ApiTags("penalidade-controller")
export class PenalidadeController {
    public constructor(
        @Inject(Providers.PenalidadeService)
        private readonly service: IPenalidadeService
    ) {  }
    
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: GetPenalidadeTableDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: RequestError })
    public async findPenalidadeTable(): Promise<GetPenalidadeTableDto> {
        return await this.service.findPenalidadeTable();
    }
}