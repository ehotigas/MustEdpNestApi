import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSimuladorFiltersDto } from "./dto/GetSimuladorFiltersDto";
import { ILoggerFactory } from "src/LoggerModule/LoggerFactory";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
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
     * @param {GetSimuladorFiltersDto} filter
     * @returns {Promise<SelectQueryBuilder<Simulador>>}
     */
    getFilterQuery(filter: GetSimuladorFiltersDto): Promise<SelectQueryBuilder<Simulador>>;

    /**
     * @returns {Repository<Simulador>}
     */
    getRepository(): Repository<Simulador>;
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

    public getRepository(): Repository<Simulador> {
        return this.repository;
    }

    public async getFilterQuery(filter: GetSimuladorFiltersDto): Promise<SelectQueryBuilder<Simulador>> {
        let query = this.repository.createQueryBuilder("simulador");
        const demanda = filter.TipoDemanda;
        query = query.where('simulador.TipoDemanda = :demanda', { demanda });
        Object.keys(filter).map((key: string) => {
            if (!["TipoDemanda", "Ano", "Empresa", "Posto", "Ponto"].includes(key) && filter[key] !== "Todos") {
                const value = filter[key];
                query = query.andWhere(`simulador.${key} = :value`, { value });
            }
        });

        if (filter.Ponto !== "Todos") {
            const ponto = filter.Ponto;
            query = query.andWhere(`simulador.Ponto = :ponto`, { ponto });
        }

        if (filter.Posto !== "Todos") {
            const posto = filter.Posto;
            query = query.andWhere(`simulador.Posto = :posto`, { posto });
        }

        if (filter.Ano !== "Todos") {
            const ano = filter.Ano;
            query = query.andWhere(`substring(simulador.Data, 1, 4) = :ano`, { ano });
        }
        if (filter?.Empresa) {
            const region = filter.Empresa;
            query = query.andWhere(`simulador.Empresa = :region`, { region });
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

    public async generate(): Promise<Simulador[]> {
        try {
            return await this.repository.query(`
                insert into Simulador (Data, Ponto, Posto, TipoDemanda, Demanda, TipoContrato, Contrato, TarifaDra, TarifaDrp, Confiabilidade, Piu, \`Add\`, Pis, Eust, Dra, Drp, Empresa)
                with BaseTarifaDrp as (
                    select
                        Ponto,
                        Posto,
                        Data,
                        Tarifa as TarifaDrp,
                        Empresa
                    from Tarifa
                        where TipoTarifa = 'Tarifa DRP'
                ), BaseTarifaDra as (
                    select
                        Ponto,
                        Posto,
                        Data,
                        Tarifa as TarifaDra,
                        Empresa
                    from Tarifa
                        where TipoTarifa = 'Tarifa DRA'
                ), BaseTarifa as (
                    select
                        A.*,
                        B.TarifaDra
                    from BaseTarifaDrp A left join BaseTarifaDra B on (
                        A.Ponto = B.Ponto and
                        A.Posto = B.Posto and
                        A.Data = B.Data and
                        A.Empresa = B.Empresa
                    )
                ), BaseMust as (
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
                        inner join BaseTarifa C on (
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
                        when A.Ponto in ('Cebrasp 88kV', 'DCTA 88kV', 'Embraer 88kV', 'Mogi 230kV', 'Petrobrás Gleba D 138kV', 'Petrobrás RPO 138kV', 'Petrom 138kV', 'Sifão 138kV') then 0
                        when Demanda > Contrato*1.1 then (Demanda - Contrato * 1.1) * 3 * TarifaDrp
                        else 0
                    end as Piu,
                    case
                        when A.Ponto in ('Cebrasp 88kV', 'DCTA 88kV', 'Embraer 88kV', 'Mogi 230kV', 'Petrobrás Gleba D 138kV', 'Petrobrás RPO 138kV', 'Petrom 138kV', 'Sifão 138kV') then 0
                        when Demanda > Contrato then (Demanda - Contrato) * TarifaDrp
                        else 0
                    end as \`Add\`,
                    case
                        when A.Ponto in ('Cebrasp 88kV', 'DCTA 88kV', 'Embraer 88kV', 'Mogi 230kV', 'Petrobrás Gleba D 138kV', 'Petrobrás RPO 138kV', 'Petrom 138kV', 'Sifão 138kV') then 0
                        else coalesce(B.Pis, 0)
                    end as Pis,
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