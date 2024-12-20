import { GetPenalidadeTableDto } from "./dto/get-penalidade-table.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { IPenalidadeAdapter } from "./penalidade.adapter";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";


export interface IPenalidadeService {
    findPenalidadeTable(year: number): Promise<GetPenalidadeTableDto>;
    findPenalidadeChat(year: number, ponto: string, posto: Posto, contrato: string, demanda: string): Promise<GetPenalidadeTableDto>;
}


@Injectable()
export class PenalidadeService implements IPenalidadeService {
    private readonly logger = new Logger(PenalidadeService.name);
    public constructor(
        @Inject(Providers.PenalidadeAdapter)
        private readonly adapter: IPenalidadeAdapter
    ) {  }

    public async findPenalidadeTable(year: number): Promise<GetPenalidadeTableDto> {
        this.logger.log(`Fetching penalidade table`);
        return {
            data: await this.adapter.findPenalidadeTable(year)
        };
    }

    public async findPenalidadeChat(year: number, ponto: string, posto: Posto, contrato: string, demanda: string): Promise<GetPenalidadeTableDto> {
        this.logger.log(`Fetching penalidade chart data`);
        return {
            data: await this.adapter.findPenalidadeChat(year, ponto, posto, contrato, demanda)
        };
    }
}