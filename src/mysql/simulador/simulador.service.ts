import { GetPenalityChartResponseDto } from "./dto/get-penality-chart-response.dto";
import { GetSimuladorDataDto } from "./dto/get-simulador-data.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ISimuladorAdapter } from "./simulador.adapter";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";


export interface ISimuladorService {
    findData(year: number, region: Region): Promise<GetSimuladorDataDto>;
    findPenalitiesChart(ponto: string, year: number, contrato: string, demanda: string): Promise<GetPenalityChartResponseDto>;
}


@Injectable()
export class SimuladorService implements ISimuladorService {
    private readonly logger = new Logger(SimuladorService.name);
    public constructor(
        @Inject(Providers.SimuladorAdapter)
        private readonly adapter: ISimuladorAdapter
    ) {  }

    public async findData(year: number, region: Region): Promise<GetSimuladorDataDto> {
        this.logger.log(`Fetching simulador data for year: ${year}`);
        const data = await this.adapter.findData(year, region);
        // console.log(data);
        return { data };
    }

    public async findPenalitiesChart(ponto: string, year: number, contrato: string, demanda: string): Promise<GetPenalityChartResponseDto> {
        this.logger.log(`Fetching simulador data for ponto: ${ponto}, year: ${year}, contrato: ${contrato}, demanda: ${demanda}`);
        const data = await this.adapter.findPenalitiesChart(ponto, year, contrato, demanda);
        // console.log(data);
        return { data };
    }
}