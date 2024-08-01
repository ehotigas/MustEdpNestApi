import { GetPenalidadeChartDataDto } from "./dto/GetPenalidadeChartDataDto";
import { GetDemandaChartDataDto } from "./dto/GetDemandaChartDataDto";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { SimuladorAdapterInterface } from "./SimuladorAdapter";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { Penalidade } from "src/types/Penalidade";
import { Providers } from "src/Providers";

export interface SimuladorServiceInterface {
    findAll: (filter: GetSimuladorFiltersDto) => Promise<GetSimuladorDto | RequestError>
    findDemandaChartData: (filter: GetSimuladorFiltersDto) => Promise<GetDemandaChartDataDto | RequestError>
    findPenalidadeChartData: (filter: GetSimuladorFiltersDto, penalidade: Penalidade) => Promise<GetPenalidadeChartDataDto | RequestError>
}


@Injectable()
export class SimuladorService implements SimuladorServiceInterface {
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: SimuladorAdapterInterface
    ) {  }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<GetSimuladorDto | RequestError> {
        const data = await this.adapter.findAll(filter);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            data: data
        };
    }

    public async findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<GetDemandaChartDataDto | RequestError> {
        const data = await this.adapter.findDemandaChartData(filter);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            data: data
        };
    }

    public async findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<GetPenalidadeChartDataDto | RequestError> {
        const data = await this.adapter.findPenalidadeChartData(filter, penalidade);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            data: data
        };
    }
}