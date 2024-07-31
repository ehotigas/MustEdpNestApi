import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { SimuladorAdapterInterface } from "./SimuladorAdapter";
import { GetSimuladorDto } from "./dto/GetSimuladorDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { Providers } from "src/Providers";

export interface SimuladorServiceInterface {
    findAll: (filter: GetSimuladorFiltersDto) => Promise<GetSimuladorDto | RequestError>
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
}