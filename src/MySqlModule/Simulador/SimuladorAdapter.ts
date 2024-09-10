import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { PenalidadeChartData } from "./PenalidadeChartData";
import { Repository, SelectQueryBuilder } from "typeorm";
import { DemandaChartData } from "./DemandaChartData";
import { InjectRepository } from "@nestjs/typeorm";
import { Penalidade } from "src/types/Penalidade";
import { SummaryData } from "./SummaryData";
import { Providers } from "src/Providers";
import { Region } from "src/types/Region";
import { Simulador } from "./Simulador";
import { GetSummaryFiltersDto } from "./dto/GetSummaryFiltersDto";

export interface ISimuladorAdapter {
    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<Simulador[]>}
     * @throws {InternalServerErrorException}
     */
    findAll(filter: GetSimuladorFiltersDto): Promise<Simulador[]>;

    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<DemandaChartData[]>}
     * @throws {InternalServerErrorException}
     */
    findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<DemandaChartData[]>;

    /**
     * @async
     * @param {GetSimuladorFiltersDto} filter
     * @param {Penalidade} penalidade
     * @returns {Promise<PenalidadeChartData[]>}
     * @throws {InternalServerErrorException}
     */
    findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<PenalidadeChartData[]>;

    /**
     * @async
     * @returns {Promise<Simulador[]>}
     * @throws {InternalServerErrorException}
     */
    generate(): Promise<Simulador[]>;

    /**
     * @async
     * @returns {Promise<Simulador[]>}
     * @throws {InternalServerErrorException}
     */
    removeAll(): Promise<Simulador[]>;

    /**
     * @async
     * @param {GetSummaryFiltersDto} filter
     * @returns {Promise<SummaryData[]>}
     * @throws {InternalServerErrorException}
     */
    getSummaryChart(filter: GetSummaryFiltersDto): Promise<SummaryData[]>;
}

@Injectable()
export class SimuladorAdapter implements ISimuladorAdapter {
    private readonly logger: Logger;
    public constructor(
        @InjectRepository(Simulador)
        private readonly repository: Repository<Simulador>,
        @Inject(Providers.LOGGER_FACTORY)
        loggerFactory: ILoggerFactory
    ) {
        this.logger = loggerFactory.getInstance("SimuladorAdapter");
    }

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

    public async findAll(filter: GetSimuladorFiltersDto): Promise<Simulador[]> {
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
                "simulador.TarifaDrp as TarifaDrp",
                "simulador.TarifaDra as TarifaDra",
                "simulador.Confiabilidade as Confiabilidade",
                "simulador.Piu as Piu",
                "simulador.`Add` as `Add`",
                "simulador.Pis as Pis",
                "simulador.Eust as Eust",
                "simulador.Empresa as Empresa",
            ]);
            return await query.getRawMany();
        }
        catch (error) {
            this.logger.error(`Fail to fetch all simulator`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async findDemandaChartData(filter: GetSimuladorFiltersDto): Promise<DemandaChartData[]> {
        try {
            let query = await this.getFilterQuery(filter);
            query = query.groupBy("simulador.Data");
            query = query.addGroupBy("simulador.TipoContrato");
            query = query.select([
                "simulador.Data as Data",
                "simulador.TipoContrato as TipoContrato",
                "sum(simulador.Demanda) as Demanda",
                "sum(simulador.Piu)/1000000 as Piu",
                "sum(simulador.`Add`)/1000000 as `Add`",
                "sum(simulador.Pis)/1000000 as Pis",
                "sum(simulador.Eust)/1000000 as Eust",
            ]);
            query = query.orderBy("Data", "ASC");
            return await query.getRawMany();
        }
        catch (error) {
            this.logger.error(`Fail to fetch demanda chart data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async findPenalidadeChartData(filter: GetSimuladorFiltersDto, penalidade: Penalidade): Promise<PenalidadeChartData[]> {
        try {
            let query = await this.getFilterQuery(filter);
            let arr = [ `sum(simulador.${penalidade})/1000000 as [${penalidade}]` ];
            if (penalidade === Penalidade.TODAS) {
                arr = [
                    "sum(simulador.Piu)/1000000 as Piu",
                    "sum(simulador.`Add`)/1000000 as `Add`",
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
            this.logger.error(`Fail to fetch penalidade chart data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async generate(): Promise<Simulador[]> {
        try {
            return await this.repository.query(`
                insert into Simulador (Data, Ponto, Posto, TipoDemanda, Demanda, TipoContrato, Contrato, TarifaDra, TarifaDrp, Confiabilidade, Piu, \`Add\`, Pis, Eust, Dra, Drp, Empresa)
                with BaseMust as (
                    select
                        A.*,
                        B.TipoContrato,
                        B.Contrato,
                        C.TarifaDra,
                        C.TarifaDrp,
                        D.Confiabilidade,
                        E.Contrato as ContratoOrcado
                    from Demanda A
                        inner join Contrato B on (
                            A.Ponto = B.Ponto and
                            A.Posto = B.Posto and
                            A.Data = B.Data and
                            A.Empresa = B.Empresa
                        )
                        inner join Tarifa C on (
                            A.Ponto = C.Ponto and
                            A.Posto = C.Posto and
                            A.Data = C.Data and
                            A.Empresa = C.Empresa
                        )
                        inner join Confiabilidade D on (
                            A.Ponto = D.Ponto and
                            A.Posto = D.Posto and
                            A.Data = D.Data and
                            A.Empresa = D.Empresa
                        )
                        inner join Contrato E on (
                            A.Ponto = E.Ponto and
                            A.Posto = E.Posto and
                            A.Data = E.Data and
                            A.Empresa = E.Empresa and
                            E.TipoContrato = 'Orçado'
                    )
                ),
                Pis as (
                    select
                        substring(Data, 1, 4) Ano,
                        Ponto,
                        Posto,
                        TipoDemanda,
                        TipoContrato,
                        Empresa,
                        case
                            when max(Demanda) >= max(Contrato)*0.9 - max(Confiabilidade) then 0
                            else (max(Contrato)*0.9 - max(Confiabilidade) - max(Demanda)) * 12 * max(TarifaDrp)
                        end as Pis
                    from BaseMust
                        group by
                            substring(Data, 1, 4),
                            Ponto,
                            Posto,
                            TipoDemanda,
                            TipoContrato,
                            Empresa
                )

                select
                    A.Data,
                    A.Ponto,
                    A.Posto,
                    A.TipoDemanda,
                    A.Demanda,
                    A.TipoContrato,
                    A.Contrato,
                    A.TarifaDra,
                    A.TarifaDrp,
                    A.Confiabilidade,
                    case
                        when Demanda > Contrato*1.1 then (Demanda - Contrato * 1.1) * 3 * TarifaDrp
                        else 0
                    end as Piu,
                    case
                        when Demanda > Contrato then (Demanda - Contrato) * TarifaDrp
                        else 0
                    end as \`Add\`,
                    coalesce(B.Pis, 0) as Pis,
                    TarifaDrp * Contrato as Eust,
                    TarifaDra * ContratoOrcado as Dra,
                    TarifaDrp * ContratoOrcado as Drp,
                    A.Empresa
                from BaseMust A
                    left join Pis B on (
                        A.Ponto = B.Ponto and
                        A.Posto = B.Posto and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
                        A.Empresa = B.Empresa and
                        substring(A.Data, 1, 4) = B.Ano and
                        substring(A.Data, 6, 2) = '12'
                    )
            `);
        }
        catch (error) {
            this.logger.error(`Fail generate simulator data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    public async getSummaryChart(filter: GetSummaryFiltersDto): Promise<SummaryData[]> {
        return await this.repository.query(`
            with Db as (
                select
                    Empresa,
                    Data,
                    substring(Data, 1, 4) as Ano,
                    substring(Data, 6, 2) as Mes,
                    TipoDemanda,
                    TipoContrato,
                    sum(Contrato) as Contrato,
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
                        else coalesce(B.Drp, 0) - A.Dra
                    end as ParcelaBTemp
                from Db A left join Db B on (
                    A.Empresa = B.Empresa and
                    A.TipoDemanda = B.TipoDemanda and
                    A.TipoContrato = B.TipoContrato and
                    A.Ano = B.Ano + 1 and
                    A.Mes = B.Mes
                ) order by A.Data
            )

            select
                A.Empresa,
                A.Data,
                A.TipoDemanda,
                A.TipoContrato,
                A.Contrato,
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
        `);
    }

    public async removeAll(): Promise<Simulador[]> {
        try {
            return await this.repository.query(`delete from simulador where Id >= 0`);
        }
        catch (error) {
            this.logger.error(`Fail remove all simulator data`, error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}