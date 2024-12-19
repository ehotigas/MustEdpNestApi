import { GetSimuladorDataDto } from "./dto/get-simulador-data.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ISimuladorAdapter } from "./simulador.adapter";
import { Providers } from "src/Providers";


export interface ISimuladorService {
    findData(year: number): Promise<GetSimuladorDataDto>;
}


@Injectable()
export class SimuladorService implements ISimuladorService {
    private readonly logger = new Logger(SimuladorService.name);
    public constructor(
        @Inject(Providers.SimuladorAdapter)
        private readonly adapter: ISimuladorAdapter
    ) {  }

    public async findData(year: number): Promise<GetSimuladorDataDto> {
        this.logger.log(`Fetching simulador data for year: ${year}`);
        return {
            data: await this.adapter.findData(year)
        };
    }
}