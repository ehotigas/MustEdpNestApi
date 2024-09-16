import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { ISimuladorAdapter } from "../SimuladorAdapter";
import { SummaryData } from "./SummaryData";
import { Providers } from "src/Providers";

export interface ISummaryAdapter {
    /**
     * @async
     * @param {GetSummaryFiltersDto} filter
     * @returns {Promise<SummaryData[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSummaryFiltersDto): Promise<SummaryData[]>;
}

@Injectable()
export class SummaryAdapter implements ISummaryAdapter {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: ISimuladorAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosAdapter");
    }

    public async findAll(filter: GetSummaryFiltersDto): Promise<SummaryData[]> {
        // ParcelaB: DRA(ano atual) - DRP(ano anterior)+ParcelaB(ano anterior)
        // ParcelaA: DRP(ano anterior) - DRA(ano atual)
        try {
            return await this.adapter.getRepository().query(`
                with Db as (
                    select
                        Empresa,
                        Data,
                        substring(Data, 1, 4) as Ano,
                        substring(Data, 6, 2) as Mes,
                        TipoDemanda,
                        TipoContrato,
                        sum(Contrato) as Contrato,
                        sum(Demanda) as Demanda,
                        sum(Piu) as Piu,
                        sum(\`Add\`) as \`Add\`,
                        sum(Eust) as Eust,
                        sum(Pis) as Pis,
                        sum(Dra) as Dra,
                        sum(Drp) as Drp
                    from simulador
                    group by
                        Data,
                        Empresa,
                        TipoDemanda,
                        TipoContrato
                ), Parcela as (
                    select
                        A.*,
                        coalesce(B.Drp, 0) - A.Dra as ParcelaA,
                        case
                            when (A.Ano % 4 = 2 and A.Mes >= 10) or (A.Ano % 4 = 3 and A.Mes <= 9) then 0
                            else A.Dra - coalesce(B.Drp, 0)
                        end as ParcelaBTemp
                    from Db A left join Db B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    ) order by A.Data
                ), FinalDB as (
                    select
                        A.Empresa,
                        A.Data,
                        A.Ano,
                        A.TipoDemanda,
                        A.TipoContrato,
                        A.Contrato,
                        A.Demanda,
                        A.Piu,
                        A.Add,
                        A.Eust,
                        A.Pis,
                        A.Dra,
                        A.Drp,
                        A.ParcelaA,
                        case
                            when (A.Ano % 4 = 2 and A.Mes >= 10) or (A.Ano % 4 = 3 and A.Mes <= 9) then 0
                            else A.ParcelaBTemp + coalesce(B.ParcelaBTemp, 0)
                        end as ParcelaB
                    from Parcela A left join Parcela B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    )
                        where (
                            A.Empresa = '${filter.Empresa}' and
                            A.TipoContrato = '${filter.TipoContrato}' and
                            A.TipoDemanda = '${filter.TipoDemanda}' 
                        )
                        order by A.Data asc
                )
    
                select
                    Empresa,
                    Ano,
                    TipoDemanda,
                    TipoContrato,
                    sum(Contrato)/1000 as Contrato,
                    sum(Demanda)/1000 as Demanda,
                    sum(Piu) as Piu,
                    sum(\`Add\`) as \`Add\`,
                    sum(Eust) as Eust,
                    sum(Pis) as Pis,
                    sum(Dra) as Dra,
                    sum(Drp) as Drp,
                    sum(ParcelaA)/1000000 as ParcelaA,
                    sum(ParcelaB)/1000000 as ParcelaB,
                    -1 * sum(\`Add\` + Piu + Pis)/1000000 as CustoTotal,
                    sum(-1 * (\`Add\` + Piu + Pis) + ParcelaA + ParcelaB)/1000000 as Total
                from FinalDB
                    group by
                        Ano,
                        Empresa,
                        TipoContrato,
                        TipoDemanda
            `);
        }
        catch (error) {
            this.logger.error(`Fail to fetch summary data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}