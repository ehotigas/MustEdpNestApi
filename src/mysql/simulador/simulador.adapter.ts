import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ISimuladorQueryBuilder } from "./simulador-query-builder";
import { PenalityChartDto } from "./dto/penality-chart.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Simulador } from "./simulador.entity";
import { Param } from "../param/param.entity";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";
import { Repository } from "typeorm";


export interface ISimuladorAdapter {
    findData(year: number, region: Region): Promise<Simulador[]>;
    findPenalitiesChart(ponto: string, year: number, contrato: string, demanda: string): Promise<PenalityChartDto[]>;
}


@Injectable()
export class SimuladorAdapter implements ISimuladorAdapter {
    private readonly logger = new Logger(SimuladorAdapter.name);
    public constructor(
        @InjectRepository(Param)
        private readonly repository: Repository<Param>,
        @Inject(Providers.SimuladorQueryBuilder)
        private readonly builder: ISimuladorQueryBuilder
    ) {  }

    public async findData(year: number, region: Region): Promise<Simulador[]> {
        try {
            await this.repository.query(this.builder.dropBaseCustos());
            await this.repository.query(this.builder.createBaseCustos(year));
            await this.repository.query(this.builder.dropTablePis());
            await this.repository.query(this.builder.createTablePis());
            const data = await this.repository.query(this.builder.getSimuladorData(region));
            await this.repository.query(this.builder.dropBaseCustos());
            await this.repository.query(this.builder.dropTablePis());
            return data;
        }
        catch(error) {
            this.logger.error(`Fail to fetch simulador data for year: ${year}.`, error.stack);
            throw new InternalServerErrorException(`Fail to fetch simulador data for year: ${year}.`, error.message);
        }
    }

    public async findPenalitiesChart(ponto: string, year: number, contrato: string, demanda: string): Promise<PenalityChartDto[]> {
        return await this.repository.query(`
            with contratos as (
                select
                    a.pontoId,
                    a.data,
                    a.posto,
                    a.cenario as tipo_contrato,
                    b.valor as contrato
                from edp.param a inner join edp.contrato b on a.id = b.demandaId
                    where year(a.data) = ${year} and a.pontoId = '${ponto}' and ((a.cenario = '${contrato}' and data > now()) or a.cenario = 'Realizado' and data <= now())
            ), demanda as (
                select
                    pontoId,
                    data,
                    posto,
                    cenario as tipo_demanda,
                    valor as demanda
                from edp.param where tipo_dado = 'DEMANDA' and year(data) = ${year} and pontoId = '${ponto}' and ((cenario = '${demanda}' and data > now()) or cenario = 'Realizado' and data <= now())
            ), confiabilidade as (
                select
                    pontoId,
                    data,
                    posto,
                    valor as confiabilidade
                from edp.param where tipo_dado = 'CONFIABILIDADE' and year(data) = ${year} and pontoId = '${ponto}'
            ), tarifa as (
                select
                    pontoId,
                    data,
                    posto,
                    valor as tarifa
                from edp.param where tipo_dado = 'TARIFA' and cenario = 'DRP' and year(data) = ${year} and pontoId = '${ponto}'
            ), valor_eust as (
                select
                    a.pontoId as ponto,
                    a.data,
                    a.posto,
                    a.tipo_contrato,
                    b.tipo_demanda,
                    a.contrato,
                    b.demanda,
                    c.confiabilidade,
                    d.tarifa,
                    a.contrato * d.tarifa as valor_eust,
                    case
                        when b.demanda > a.contrato then d.tarifa * (b.demanda - a.contrato)
                        else 0
                    end as valor_add,
                    case
                        when b.demanda > a.contrato * 1.1 then d.tarifa * (b.demanda - a.contrato * 1.1) * 3
                        else 0
                    end as valor_piu
                from contratos a
                    inner join demanda b on a.pontoId = b.pontoId and a.data = b.data and a.posto = b.posto
                    inner join confiabilidade c on a.pontoId = c.pontoId and a.data = c.data and a.posto = c.posto
                    inner join tarifa d on a.pontoId = d.pontoId and a.data = d.data and a.posto = d.posto
            ), pis as (
                select
                    ponto,
                    posto,
                    year(data) as ano,
                    tipo_demanda,
                    tipo_contrato,
                    min(contrato) as contrato,
                    max(confiabilidade) as confiabilidade,
                    max(demanda) as demanda,
                    max(tarifa) as tarifa,
                    case 
                        when min(contrato)*0.9 - max(confiabilidade) > max(demanda) then ((min(contrato) * 0.9 - max(confiabilidade)) - max(demanda)) * 12 * max(tarifa)
                        else 0
                    end as pis
                from valor_eust
                    group by ponto, posto, year(data), tipo_demanda, tipo_contrato
            ), custos as (
                select
                    a.*,
                    coalesce(b.pis, 0) as valor_pis,
                    coalesce(b.pis, 0) + valor_add + valor_piu as valor_penalidades
                from valor_eust a
                    left join pis b on (
                        a.ponto = b.ponto and
                        a.posto = b.posto and
                        month(a.data) = 12 and
                        a.tipo_demanda = b.tipo_demanda and
                        a.tipo_contrato = b.tipo_contrato
                    )
                    inner join edp.ponto c on a.ponto = c.id
            )
            select
                data,
                sum(contrato) as contrato,
                sum(
                    case when posto = 'Ponta' then contrato
                    else 0 end
                ) as contratoPonta,
                sum(
                    case when posto = 'Fora Ponta' then contrato
                    else 0 end
                ) as contratoForaPonta,
                sum(
                    case when posto = 'Ponta' then demanda
                    else 0 end
                ) as demandaPonta,
                sum(
                    case when posto = 'Fora Ponta' then demanda
                    else 0 end
                ) as demandaForaPonta,
                sum(
                    case when posto = 'Ponta' then valor_eust
                    else 0 end
                ) as eustPonta,
                sum(
                    case when posto = 'Fora Ponta' then valor_eust
                    else 0 end
                ) as eustForaPonta,
                sum(
                    case when posto = 'Ponta' then valor_add
                    else 0 end
                ) as addPonta,
                sum(
                    case when posto = 'Fora Ponta' then valor_add
                    else 0 end
                ) as addForaPonta,
                sum(
                    case when posto = 'Ponta' then valor_piu
                    else 0 end
                ) as piuPonta,
                sum(
                    case when posto = 'Fora Ponta' then valor_piu
                    else 0 end
                ) as piuForaPonta,
                sum(
                    case when posto = 'Ponta' then valor_pis
                    else 0 end
                ) as pisPonta,
                sum(
                    case when posto = 'Fora Ponta' then valor_pis
                    else 0 end
                ) as pisForaPonta
            from custos
                group by data
                order by data asc;
        `);
    }
}