import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { PenalidadeChartData } from "./PenalidadeChartData";
import { Repository, SelectQueryBuilder } from "typeorm";
import { DemandaChartData } from "./DemandaChartData";
import { InjectRepository } from "@nestjs/typeorm";
import { Penalidade } from "src/types/Penalidade";
import { Providers } from "src/Providers";
import { Simulador } from "./Simulador";

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
                "simulador.Tarifa as Tarifa",
                "simulador.Confiabilidade as Confiabilidade",
                "simulador.Piu as Piu",
                "simulador.`Add` as `Add`",
                "simulador.Pis as Pis",
                "simulador.Eust as Eust",
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
                insert into Simulador (Data, Ponto, Posto, TipoDemanda, Demanda, TipoContrato, Contrato, Tarifa, Confiabilidade, Piu, \`Add\`, Pis, Eust)
                with BaseMust as (
                select
                    A.*,
                    B.TipoContrato,
                    B.Contrato,
                    C.Tarifa,
                    D.Confiabilidade
                from Demanda A
                    inner join Contrato B on (
                    A.Ponto = B.Ponto and
                    A.Posto = B.Posto and
                    A.Data = B.Data
                    )
                    inner join Tarifa C on (
                    A.Ponto = C.Ponto and
                    A.Posto = C.Posto and
                    A.Data = C.Data
                    )
                    inner join Confiabilidade D on (
                    A.Ponto = D.Ponto and
                    A.Posto = D.Posto and
                    A.Data = D.Data
                    )
                ),
                Pis as (
                select
                    substring(Data, 1, 4) Ano,
                    Ponto,
                    Posto,
                    TipoDemanda,
                    TipoContrato,
                    case
                    when max(Demanda) >= max(Contrato)*0.9 - max(Confiabilidade) then 0
                    else (max(Contrato)*0.9 - max(Confiabilidade) - max(Demanda)) * 12 * max(Tarifa)
                    end as Pis
                from BaseMust
                    group by
                    substring(Data, 1, 4),
                    Ponto,
                    Posto,
                    TipoDemanda,
                    TipoContrato
                )

                select
                    A.Data,
                    A.Ponto,
                    A.Posto,
                    A.TipoDemanda,
                    A.Demanda,
                    A.TipoContrato,
                    A.Contrato,
                    A.Tarifa,
                    A.Confiabilidade,
                    case
                        when Demanda > Contrato*1.1 then (Demanda - Contrato * 1.1) * 3 * Tarifa
                        else 0
                    end as Piu,
                    case
                        when Demanda > Contrato then (Demanda - Contrato) * Tarifa
                        else 0
                    end as \`Add\`,
                    coalesce(B.Pis, 0) as Pis,
                    Tarifa * Contrato as Eust
                from BaseMust A
                    left join Pis B on (
                        A.Ponto = B.Ponto and
                        A.Posto = B.Posto and
                        A.TipoDemanda = B.TipoDemanda and
                        A.TipoContrato = B.TipoContrato and
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