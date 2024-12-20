import { GetPenalidadeTableDto } from "./dto/get-penalidade-table.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { IPenalidadeAdapter } from "./penalidade.adapter";
import { Providers } from "src/Providers";


export interface IPenalidadeService {
    findPenalidadeTable(): Promise<GetPenalidadeTableDto>; 
}


@Injectable()
export class PenalidadeService implements IPenalidadeService {
    private readonly logger = new Logger(PenalidadeService.name);
    public constructor(
        @Inject(Providers.PenalidadeAdapter)
        private readonly adapter: IPenalidadeAdapter
    ) {  }

    public async findPenalidadeTable(): Promise<GetPenalidadeTableDto> {
        this.logger.log(`Fetching penalidade table`);
        return {
            data: await this.adapter.findPenalidadeTable()
        };
    }
}