import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetContratoTableFilterDto } from "./dto/get-contrato-table-filter.dto";
import { SimuladorContratoTable } from "./simulador-contrato-table.entity";
import { IContratoQueryGenerator } from "./contrato-sql-query";
import { ContratoTable } from "./contrato-table.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Param } from "../param/param.entity";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";
import { Repository } from "typeorm";


export interface IContratoAdapter {
    findContratoTable(ponto: string, ano: number, cenario: string): Promise<ContratoTable[]>;
    generate(year: number): Promise<string>;
    findByDemanda(demanda: Param): Promise<Contrato>;
    findTableFilters(): Promise<GetContratoTableFilterDto>;
    findSimuladorContratoTable(cenario: string, ano: number): Promise<SimuladorContratoTable[]>;
    save(input: Omit<Contrato, "id">): Promise<Contrato>;
    update(id: number, input: Partial<Contrato>): Promise<Contrato>;
    remove(id: number): Promise<Contrato>;
    removeByCenario(cenario: string): Promise<boolean>;
}


@Injectable()
export class ContratoAdapter implements IContratoAdapter {
    private readonly logger = new Logger(ContratoAdapter.name);
    public constructor(
        @InjectRepository(Contrato)
        private readonly repository: Repository<Contrato>,
        @Inject(Providers.ContratoQueryGenerator)
        private readonly queryGenerator: IContratoQueryGenerator
    ) {  }

    public async generate(year: number): Promise<string> {
        try {
            const queryList = this.queryGenerator.generate(year);

            for (const query of queryList) {
                await this.repository.query(query);
            }
            return `Contratos gerados`;
        }
        catch (error) {
            this.logger.error(`Fail to generate contratos for year: ${year}`, error.stack);
            throw new InternalServerErrorException(`Fail to generate contratos for year: ${year}`, error.message);
        }
    }

    public async findByDemanda(demanda: Param): Promise<Contrato> {
        try {
            return await this.repository.findOne({
                where: { demanda }
            });
        }
        catch (error) {
            this.logger.error(`Fail to find contrato with demanda id: ${demanda.id}`, error.stack);
            throw new InternalServerErrorException(`Fail to find contrato with demanda id: ${demanda.id}`, error.message);
        }
    }

    public async findTableFilters(): Promise<GetContratoTableFilterDto> {
        try {
            const ano: { year: string }[] = await this.repository.query(`select distinct year(data) as year from edp.contrato a inner join edp.param b on a.demandaId = b.id order by year(data) desc;`);
            const cenario: { cenario: string }[] = await this.repository.query(`select distinct cenario from edp.contrato a inner join edp.param b on a.demandaId = b.id;`);
            return {
                ano: ano.map((value) => value.year),
                cenario: cenario.map((value) => value.cenario)
            };
        }
        catch (error) {
            this.logger.error(`Fail to find table filters`, error.stack);
            throw new InternalServerErrorException(`Fail to find table filters`, error.message);
        }
    }

    public async findContratoTable(ponto: string, ano: number, cenario: string): Promise<ContratoTable[]> {
        try {
            return await this.repository.query(`
                with ultimo_contrato as (
                    select
                    b.pontoId as ponto,
                    b.data,
                    sum(a.valor) as contrato,
                    sum(
                        case when posto = 'Ponta' then a.valor
                        else 0 end
                    ) as ultimoContratoPonta,
                    sum(
                        case when posto = 'Fora Ponta' then a.valor
                        else 0 end
                    ) as ultimoContratoForaPonta
                from edp.contrato a
                    inner join edp.param b on a.demandaId = b.id
                    where pontoId = '${ponto}' and year(data) = ${ano - 1} and cenario = 'Realizado' and month(data) = 12
                    group by pontoId, data, cenario
                ), contrato_atual as (
                    select
                        b.pontoId as ponto,
                        b.data,
                        sum(a.valor) as contrato,
                        sum(
                            case when posto = 'Ponta' then a.valor
                            else 0 end
                        ) as contratoPonta,
                        sum(
                            case when posto = 'Fora Ponta' then a.valor
                            else 0 end
                        ) as contratoForaPonta,
                        sum(
                            case when posto = 'Ponta' then b.valor
                            else 0 end
                        ) as demandaPonta,
                        sum(
                            case when posto = 'Fora Ponta' then b.valor
                            else 0 end
                        ) as demandaForaPonta,
                        sum(b.valor) as demanda
                    from edp.contrato a
                        inner join edp.param b on a.demandaId = b.id
                        where pontoId = '${ponto}' and year(data) = ${ano} and cenario = '${cenario}'
                        group by pontoId, data, cenario
                        order by data
                )
                select
                    a.*,
                    b.ultimoContratoPonta,
                    b.ultimoContratoForaPonta
                from contrato_atual a left join ultimo_contrato b on a.ponto = b.ponto;
            `);
        }
        catch (error) {
            this.logger.error(`Fail to find contrato table`, error.stack);
            throw new InternalServerErrorException(`Fail to find contrato table`, error.message);
        }
    }

    public async findSimuladorContratoTable(cenario: string, ano: number): Promise<SimuladorContratoTable[]> {
        try {
            return await this.repository.query(`
                with ultimo_contrato as (
                    select
                        b.pontoId as ponto,
                        b.data,
                        sum(a.valor) as contrato,
                        sum(
                            case when posto = 'Ponta' then a.valor
                            else 0 end
                        ) as ultimoContratoPonta,
                        sum(
                            case when posto = 'Fora Ponta' then a.valor
                            else 0 end
                        ) as ultimoContratoForaPonta
                    from edp.contrato a
                        inner join edp.param b on a.demandaId = b.id
                        where year(data) = ${ano - 1} and cenario = 'Realizado' and month(data) = 12
                        group by pontoId, data, cenario
                    ), contrato_demanda as (
                        select
                            b.pontoId as ponto,
                            year(b.data) as data,
                            b.cenario,
                            sum(
                                case when b.posto = 'Ponta' and month(b.data) = 12 then a.valor 
                                else 0 end
                            ) as contratoPonta,
                            sum(
                                case when b.posto = 'Fora Ponta' and month(b.data) = 12 then a.valor 
                                else 0 end
                            ) as contratoForaPonta,
                            sum(
                                case when b.posto = 'Ponta' then b.valor 
                                else 0 end
                            ) as demandaPonta,
                            sum(
                                case when b.posto = 'Fora Ponta' then b.valor 
                                else 0 end
                            ) as demandaForaPonta
                        from edp.contrato a
                            inner join edp.param b on a.demandaId = b.id and b.cenario = '${cenario}' and year(b.data) = ${ano}
                            group by b.pontoId, b.cenario, year(b.data)
                    )
                    select
                        b.nome as nomePonto,
                        a.*,
                        ultimoContratoPonta,
                        ultimoContratoForaPonta
                    from contrato_demanda a
                        inner join edp.ponto b on a.ponto = b.id
                        inner join ultimo_contrato c on a.ponto = c.ponto;
            `);
        }
        catch (error) {
            this.logger.error(`Fail to find contrato table`, error.stack);
            throw new InternalServerErrorException(`Fail to find contrato table`, error.message);
        }
    }

    public async save(input: Omit<Contrato, "id">): Promise<Contrato> {
        try {
            return await this.repository.save(input);
        }
        catch(error) {
            this.logger.error(`Fail to save new contrato`, error.stack);
            throw new InternalServerErrorException(`Fail to save new contrato`, error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save({ ...contrato, ...input });
        }
        catch(error) {
            this.logger.error(`Fail to update contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to update contrato with id: ${id}`, error.message);
        }
    }

    public async remove(id: number): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(contrato);
        }
        catch(error) {
            this.logger.error(`Fail to remove contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove contrato with id: ${id}`, error.message);
        }
    }

    public async removeByCenario(cenario: string): Promise<boolean> {
        try {
            await this.repository.query(`
                delete contrato from edp.contrato as contrato inner join edp.param as temp on contrato.id = temp.id and temp.cenario = '${cenario}';
            `);
            return true;
        }
        catch(error) {
            this.logger.error(`Fail to remove contrato: ${cenario}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove contrato: ${cenario}`, error.message);
        }
        
    }
}