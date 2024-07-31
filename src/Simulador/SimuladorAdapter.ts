import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { RequestError } from "src/types/RequestError";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Simulador } from "./Simulador";
import { Repository } from "typeorm";

export interface SimuladorAdapterInterface {
    findAll: (filter: GetSimuladorFiltersDto) => Promise<Simulador[] | RequestError>
}

@Injectable()
export class SimuladorAdapter implements SimuladorAdapterInterface {
    public constructor(
        @InjectRepository(Simulador)
        private readonly repository: Repository<Simulador>
    ) {  }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<Simulador[] | RequestError> {
        try {
            let query = this.repository.createQueryBuilder("simulador");
            const demanda = filter.Demanda;
            query = query.where('simulador.TipoDemanda = :demanda', { demanda });
            Object.keys(filter).map((key: string) => {
                if (key != "TipoDemanda" && filter[key] !== "Todos") {
                    const value = filter[key];
                    query = query.andWhere(`simulador.${key} = :value`, { value });
                }
            });
            return await query.getRawMany();
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}