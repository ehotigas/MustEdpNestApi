import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { PenalidadeChartData } from "./PenalidadeChartData";
import { Repository, SelectQueryBuilder } from "typeorm";
import { DemandaChartData } from "./DemandaChartData";
import { RequestError } from "src/types/RequestError";
import { InjectRepository } from "@nestjs/typeorm";
import { Penalidade } from "src/types/Penalidade";
import { Injectable } from "@nestjs/common";
import { Simulador } from "./Simulador";

export interface SimuladorAdapterInterface {
    findAll: (filter: GetSimuladorFiltersDto) => Promise<Simulador[] | RequestError>
    findDemandaChartData: (filter: GetSimuladorFiltersDto) => Promise<DemandaChartData[] | RequestError>
    findPenalidadeChartData: (filter: GetSimuladorFiltersDto, penalidade: Penalidade) => Promise<PenalidadeChartData[] | RequestError>
}

@Injectable()
export class SimuladorAdapter implements SimuladorAdapterInterface {
    public constructor(
        @InjectRepository(Simulador)
        private readonly repository: Repository<Simulador>
    ) {  }

    private async getFilterQuery(filter: GetSimuladorFiltersDto): Promise<SelectQueryBuilder<Simulador>> {
        let query = this.repository.createQueryBuilder("simulador");
        const demanda = filter.TipoDemanda;
        query = query.where('simulador.TipoDemanda = :demanda', { demanda });
        Object.keys(filter).map((key: string) => {
            if (!["TipoDemanda", "Ano"].includes(key) && filter[key] !== "Todos") {
                const value = filter[key];
                query = query.andWhere(`simulador.${key} = :value`, { value });
            }
        });
        if (filter.Ano !== "Todos") {
            const ano = filter.Ano;
            query = query.andWhere(`substring(cast(simulador.Data as varchar), 1, 4) = :ano`, { ano });
        }
        return query;
    }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<Simulador[] | RequestError> {
        try {
            let query = await this.getFilterQuery(filter);
            query = query.select([
                "simulador.Id as Id",
                "simulador.Data as Data",
                "simulador.Ponto as Ponto",
                "simulador.Posto as Posto",
                "simulador.TipoDemanda as TipoDemanda",
                "simulador.Demanda as Demanda",
                "simulador.TipoContrato as TipoContrato",
                "simulador.Contrato as Contrato",
                "simulador.Tarifa as Tarifa",
                "simulador.Confiabilidade as Confiabilidade",
                "simulador.Piu as Piu",
                "simulador.Add as [Add]",
                "simulador.Pis as Pis",
                "simulador.Eust as Eust",
            ]);
            return await query.getRawMany();
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<DemandaChartData[] | RequestError> {
        try {
            let query = await this.getFilterQuery(filter);
            query = query.groupBy("simulador.Data");
            query = query.addGroupBy("simulador.TipoContrato");
            query = query.select([
                "simulador.Data as Data",
                "simulador.TipoContrato as TipoContrato",
                "sum(simulador.Demanda) as Demanda",
                "sum(simulador.Piu)/1000000 as Piu",
                "sum(simulador.Add)/1000000 as [Add]",
                "sum(simulador.Pis)/1000000 as Pis",
                "sum(simulador.Eust)/1000000 as Eust",
            ]);
            query = query.orderBy("Data", "ASC");
            return await query.getRawMany();
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<PenalidadeChartData[] | RequestError> {
        try {
            let query = await this.getFilterQuery(filter);
            let arr = [ `sum(simulador.${penalidade})/1000000 as [${penalidade}]` ];
            if (penalidade === Penalidade.TODAS) {
                arr = [
                    "sum(simulador.Piu)/1000000 as Piu",
                    "sum(simulador.Add)/1000000 as [Add]",
                    "sum(simulador.Pis)/1000000 as Pis",
                    "sum(simulador.Eust)/1000000 as Eust"
                ];
            }
            query = query.groupBy("simulador.TipoContrato");
            query = query.select([
                "simulador.TipoContrato as TipoContrato",
                ...arr
            ]);
            query = query.orderBy("TipoContrato", "ASC");
            return await query.getRawMany();
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}