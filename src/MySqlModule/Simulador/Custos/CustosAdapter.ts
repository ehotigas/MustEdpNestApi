import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { ISimuladorAdapter } from "../SimuladorAdapter";
import { CustosChartData } from "./CustosChartData";
import { Penalidade } from "src/types/Penalidade";
import { Providers } from "src/Providers";

export interface ICustosAdapter {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @param {Penalidade} penalidade
     * @returns {Promise<PenalidadeChartData[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<CustosChartData[]>;
}

@Injectable()
export class CustosAdapter implements ICustosAdapter {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: ISimuladorAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosAdapter");
    }

    public async findAll(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<CustosChartData[]> {
        try {
            let query = await this.adapter.getFilterQuery(filter);
            let arr = [
                `sum(simulador.${penalidade})/1000000 as [${penalidade}]`,
                "sum(simulador.Contrato)/1000 as Contrato"
            ];
            if (penalidade === Penalidade.TODAS) {
                arr = [
                    "sum(simulador.Piu)/1000000 as Piu",
                    "sum(simulador.`Add`)/1000000 as `Add`",
                    "sum(simulador.Pis)/1000000 as Pis",
                    "sum(simulador.Eust)/1000000 as Eust",
                    "sum(simulador.Contrato)/1000 as Contrato",
                    "sum(simulador.Piu + simulador.Eust + simulador.`Add` + simulador.Pis)/1000000 as Total",
                ];
            }
            query = query.groupBy("simulador.TipoContrato");
            query = query.addGroupBy("simulador.Data");
            query = query.addGroupBy("simulador.Ponto");
            query = query.select([
                "simulador.TipoContrato as TipoContrato",
                "simulador.Data as Data",
                "simulador.Ponto as Ponto",
                ...arr
            ]);
            query = query.orderBy("TipoContrato", "ASC");
            return await query.getRawMany();
        }
        catch (error) {
            this.logger.error(`Fail to fetch penalidade chart data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

}