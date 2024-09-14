import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "../dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { ISimuladorAdapter } from "../SimuladorAdapter";
import { DemandaChartData } from "./DemandaChartData";
import { Providers } from "src/Providers";

export interface IDemandaChartAdapter {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<DemandaChartData[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto): Promise<DemandaChartData[]>;
}

@Injectable()
export class DemandaChartAdapter implements IDemandaChartAdapter {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: ISimuladorAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosAdapter");
    }

    public async findAll(filter: GetSimuladorFiltersDto): Promise<DemandaChartData[]> {
        try {
            let query = await this.adapter.getFilterQuery(filter);
            query = query.groupBy("simulador.Data");
            query = query.addGroupBy("simulador.TipoContrato");
            query = query.select([
                "simulador.Data as Data",
                "simulador.TipoContrato as TipoContrato",
                "sum(simulador.Demanda) as Demanda",
                "sum(simulador.Piu)/1000 as Piu",
                "sum(simulador.`Add`)/1000 as `Add`",
                "sum(simulador.Pis)/1000 as Pis",
                "sum(simulador.Eust)/1000 as Eust",
                "sum(simulador.Piu + simulador.Eust + simulador.`Add` + simulador.Pis)/1000 as Total",
            ]);
            query = query.orderBy("Data", "ASC");
            return await query.getRawMany();
        }
        catch (error) {
            this.logger.error(`Fail to fetch demanda chart data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}