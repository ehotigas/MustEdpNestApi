import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetFilterHeaderDto } from "./dto/get-filter-header.dto";
import { DemandaChart } from "./demanda-chart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Ponto } from "../ponto/ponto.entity";
import { ParamTable } from "./param-table";
import { Region } from "src/types/region";
import { Posto } from "src/types/posto";
import { Param } from "./param.entity";
import { DataType } from "./data-type";
import { Repository } from "typeorm";


export interface IParamAdapter {
    findAll(filters: Param): Promise<Param[]>;
    findById(id: number): Promise<Param>;
    findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date | string, tipoDado: DataType, cenario: string): Promise<Param>;
    findParamTable(ponto: string, ano: number, demanda: string, contrato: string): Promise<ParamTable[]>;
    findDemandaChart(ponto: string, posto: Posto, year: number): Promise<DemandaChart[]>;
    findYearDemandaChart(region: Region, posto: Posto): Promise<DemandaChart[]>;
    getFilterHeader(): Promise<GetFilterHeaderDto>;
    save(input: Omit<Param, "id">): Promise<Param>;
    update(id: number, input: Partial<Param>): Promise<Param>;
    remove(id: number): Promise<Param>;
    removeDemandaByCenario(cenario: string): Promise<boolean>;
}


@Injectable()
export class ParamAdapter implements IParamAdapter {
    private readonly logger = new Logger(ParamAdapter.name);
    public constructor(
        @InjectRepository(Param)
        private readonly repository: Repository<Param>
    ) {  }

    public async findAll(filters: Param): Promise<Param[]> {
        try {
            return await this.repository.find({
                where: filters,
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find all param`, error.stack);
            throw new InternalServerErrorException(`Fail to find all param`, error.message);
        }
    }

    public async findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date, tipoDado: DataType, cenario: string): Promise<Param> {
        try {
            return await this.repository.findOne({
                where: { ponto, posto, data, tipoDado, cenario },
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find param with ponto: ${ponto}, posto: ${posto}, data: ${data}, tipoDado: ${tipoDado}, cenario: ${cenario}`, error.stack);
            throw new InternalServerErrorException(`Fail to find param with ponto: ${ponto}, posto: ${posto}, data: ${data}, tipoDado: ${tipoDado}, cenario: ${cenario}`, error.message);
        }
    }

    public async findById(id: number): Promise<Param> {
        try {
            return await this.repository.findOne({
                where: { id },
                relations: ["ponto", "contrato"]
            });
        }
        catch(error) {
            this.logger.error(`Fail to find param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to find param with id: ${id}`, error.message);
        }
    }

    
    public async findDemandaChart(ponto: string, posto: Posto, year: number): Promise<DemandaChart[]> {
        try {
            return await this.repository.query(`
                select
                    a.data,
                    a.cenario,
                    sum(valor) as demanda
                from edp.param a
                    inner join edp.ponto b on (
                        a.pontoId = b.id and
                        a.tipo_dado = 'DEMANDA' and
                        year(a.data) = ${year} and
                        a.pontoId = '${ponto}' and
                        a.posto = '${posto}'
                    )
                    group by a.data, a.cenario
                    order by a.data, a.cenario
            `);
        }
        catch(error) {
            this.logger.error(`Fail to find demanda chart`, error.stack);
            throw new InternalServerErrorException(`Fail to find demanda chart`, error.message);
        }
    }

    public async findYearDemandaChart(region: Region, posto: Posto): Promise<DemandaChart[]> {
        try {
            return await this.repository.query(`
                select
                    year(a.data) as data,
                    a.cenario,
                    sum(valor)/1000 as demanda
                from edp.param a
                    inner join edp.ponto b on (
                        a.pontoId = b.id and
                        a.tipo_dado = 'DEMANDA' and
                        b.empresa = '${region}' and
                        a.posto = '${posto}' and
                        year(a.data) > 2014
                    )
                    group by year(a.data), a.cenario
                    order by year(a.data)
            `);
        }
        catch(error) {
            this.logger.error(`Fail to find yearly demanda chart`, error.stack);
            throw new InternalServerErrorException(`Fail to find yearly demanda chart`, error.message);
        }
    }


    public async getFilterHeader(): Promise<GetFilterHeaderDto> {
        try {
            const anoList: { year: string }[] = await this.repository.query(
                `select distinct year(data) as year from edp.param order by year(data) desc;`
            );
            const demandaList: { demanda: string }[] = await this.repository.query(`select distinct cenario as demanda from edp.param where cenario not in ('null', 'DRA', 'DRP', '') and tipo_dado = 'DEMANDA';`);
            const contratoList: { contrato: string }[] = await this.repository.query(`select distinct cenario as contrato from edp.param a inner join edp.contrato b on a.id = b.demandaid where cenario not in ('null', 'DRA', 'DRP', '');`);
            return {
                ano: anoList.map((value) => value.year),
                demanda: demandaList.map((value) => value.demanda).filter(demanda => !['null', 'DRA', 'DRP'].includes(demanda)),
                contrato: contratoList.map((value) => value.contrato).filter(contrato => !['null', 'DRA', 'DRP'].includes(contrato)),
            };
        }
        catch(error) {
            this.logger.error(`Fail fetch filter headers`, error.stack);
            throw new InternalServerErrorException(`Fail fetch filter headers`, error.message);
        }
    }

    public async findParamTable(ponto: string, ano: number, demanda: string, contrato: string): Promise<ParamTable[]> {
        try {
            return await this.repository.query(`
                with demanda as (
                    select
                        pontoId as ponto,
                        data,
                        posto,
                        valor as demanda
                    from edp.param
                        where year(data) = ${ano} and tipo_dado = 'DEMANDA' and pontoId = '${ponto}' and ((cenario = '${demanda}' and data > now()) or cenario = 'Realizado' and data <= now())
                ), contrato as (
                    select
                        a.pontoId as ponto,
                        a.data,
                        a.posto,
                        a.valor as demanda,
                        b.valor as contrato
                    from edp.param a
                        left join edp.contrato b on a.id = b.demandaId
                        where year(data) = ${ano} and tipo_dado = 'DEMANDA' and pontoId = '${ponto}' and ((cenario = '${contrato}' and data > now()) or cenario = 'Realizado' and data <= now())
                ), contrato_anterior as (
                    select
                        a.pontoId as ponto,
                        a.data,
                        a.posto,
                        b.valor as contrato
                    from edp.param a
                        left join edp.contrato b on a.id = b.demandaId
                        where year(data) = ${ano - 1} and tipo_dado = 'DEMANDA' and pontoId = '${ponto}' and ((cenario = '${contrato}' and data > now()) or cenario = 'Realizado' and data <= now())
                ), ponto_data as (
                    select distinct
                        pontoId as ponto,
                        data
                    from edp.param where year(data) = ${ano} and pontoId = '${ponto}'
                )
                select
                    a.*,
                    b.demanda as demandaPonta,
                    c.demanda as demandaForaPonta,
                    d.contrato as contratoPonta,
                    e.contrato as contratoForaPonta,
                    f.contrato as contratoAnteriorPonta,
                    g.contrato as contratoAnteriorForaPonta
                from ponto_data a
                    left join demanda b on a.data = b.data and a.ponto = b.ponto and b.posto = 'Ponta'
                    left join demanda c on a.data = c.data and a.ponto = c.ponto and c.posto = 'Fora Ponta'
                    left join contrato d on a.data = d.data and a.ponto = d.ponto and d.posto = 'Ponta'
                    left join contrato e on a.data = e.data and a.ponto = e.ponto and e.posto = 'Fora Ponta'
                    left join contrato_anterior f on month(a.data) = month(f.data) and a.ponto = f.ponto and f.posto = 'Ponta'
                    left join contrato_anterior g on month(a.data) = month(g.data) and a.ponto = g.ponto and g.posto = 'Fora Ponta'
                    order by a.data asc;
            `);
        }
        catch(error) {
            this.logger.error(`Fail fetch param table`, error.stack);
            throw new InternalServerErrorException(`Fail fetch param table`, error.message);
        }
    }

    public async save(input: Omit<Param, "id">): Promise<Param> {
        try {
            return await this.repository.save(input);
        }
        catch(error) {
            this.logger.error(`Fail to save param`, error.stack);
            throw new InternalServerErrorException(`Fail to save param`, error.message);
        }
    }

    public async update(id: number, input: Partial<Param>): Promise<Param> {
        try {
            const param = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save({ ...param, ...input });
        }
        catch(error) {
            this.logger.error(`Fail to update param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to update param with id: ${id}`, error.message);
        }
    }

    public async remove(id: number): Promise<Param> {
        try {
            const param = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(param);
        }
        catch(error) {
            this.logger.error(`Fail to remove param with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove param with id: ${id}`, error.message);
        }
    }

    public async removeDemandaByCenario(cenario: string): Promise<boolean> {
        try {
            await this.repository.query(`delete from edp.param where tipo_dado = 'DEMANDA' and cenario = '${cenario}';`);
            return true;
        }
        catch(error) {
            this.logger.error(`Fail to remove param with cenario: ${cenario}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove param with cenario: ${cenario}`, error.message);
        }
    }
}