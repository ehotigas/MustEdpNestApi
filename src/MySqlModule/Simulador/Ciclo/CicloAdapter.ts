import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSummaryFiltersDto } from "../Summary/dto/GetSummaryFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { ISimuladorAdapter } from "../SimuladorAdapter";
import { Providers } from "src/Providers";
import { Ciclo } from "./Ciclo";

export interface ICicloAdapter {
    /**
     * @async
     * @param {GetSummaryFiltersDto} filter 
     * @returns {Promise<Ciclo[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSummaryFiltersDto): Promise<Ciclo[]>;
}

@Injectable()
export class CicloAdapter implements ICicloAdapter {
    private readonly logger: Logger;
    public constructor(
        @Inject(Providers.SIMULADOR_ADAPTER)
        private readonly adapter: ISimuladorAdapter,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("CustosAdapter");
    }

    public async findAll(filter: GetSummaryFiltersDto): Promise<Ciclo[]> {
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
                        coalesce(B.Dra, 0) as DraAnt,
                        coalesce(B.Dra, 0) - A.Drp as ParcelaA,
                        case
                            when (A.Ano % 4 = 2 and A.Mes >= 10) or (A.Ano % 4 = 3 and A.Mes <= 9) then 0
                            else A.Drp - coalesce(B.Dra, 0)
                        end as ParcelaBTemp
                    from Db A left join Db B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    ) order by A.Data
                ), Ano0 as (
                    select
                        *,
                        case
                            when Mes <= 9 then 0
                            else ParcelaBTemp
                        end as ParcelaB
                    from Parcela
                        where Ano % 4 = 3
                ), Ano1 as (
                    select
                        A.*,
                        A.ParcelaBTemp + B.ParcelaB as ParcelaB
                    from Parcela A left join Ano0 B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    ) where A.Ano % 4 = 0
                ), Ano2 as (
                    select
                        A.*,
                        A.ParcelaBTemp + B.ParcelaB as ParcelaB
                    from Parcela A left join Ano1 B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    ) where A.Ano % 4 = 1
                ), Ano3 as (
                    select
                        A.*,
                        case
                            when A.Mes >= 10 then 0
                            else A.ParcelaBTemp + B.ParcelaB
                        end as ParcelaB
                    from Parcela A left join Ano2 B on (
                        A.Empresa = B.Empresa and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Ano = B.Ano + 1 and
                        A.Mes = B.Mes
                    ) where A.Ano % 4 = 2
                ), UnionDB as (
                    select * from Ano0
                    union all
                    select * from Ano1
                    union all
                    select * from Ano2
                    union all
                    select * from Ano3
                ), FinalDB as (
                    select
                        *,
                        case
                            when ((Ano - 2018) % 4 = 0) and (Mes <= 9) then cast(((Ano - 2018) div 4) as unsigned) + 1
                            else cast(((Ano - 2018) div 4) as unsigned) + 2
                        end as Ciclo
                    from UnionDB
                        where (
                            Empresa = '${filter.Empresa}' and
                            TipoContrato = '${filter.TipoContrato}' and
                            TipoDemanda = '${filter.TipoDemanda}' and
                            Data >= '2018-10-01'
                        )
                        order by Data asc
                )
    
                select
                    Empresa,
                    Ciclo,
                    TipoDemanda,
                    TipoContrato,
                    sum(ParcelaA)/1000000 as ParcelaA,
                    sum(ParcelaB)/1000000 as ParcelaB,
                    -1 * sum(\`Add\` + Piu + Pis)/1000000 as CustoTotal,
                    sum(-1 * (\`Add\` + Piu + Pis) + ParcelaA + ParcelaB)/1000000 as Total
                from FinalDB
                    group by
                        Ciclo,
                        Empresa,
                        TipoContrato,
                        TipoDemanda
                    order by Ciclo asc
            `);
        }
        catch (error) {
            this.logger.error("Fail to fetch all ciclo", error.stack);
            throw new InternalServerErrorException(``);
        }
    }
}