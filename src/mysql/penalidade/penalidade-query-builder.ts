import { Injectable } from "@nestjs/common";
import { Posto } from "src/types/posto";


export interface IPenalidadeQueryBuilder {
    dropCustosTable(): string;
    createCustosTable(year: number): string;
    dropPisTable(): string;
    createPisTable(): string;
    getPenalityData(): string;
    getPenalidadeChart(ponto: string, posto: Posto, contrato: string, demanda: string): string;
}


@Injectable()
export class PenalidadeQueryBuilder implements IPenalidadeQueryBuilder {
    public dropCustosTable(): string {
        return `drop temporary table if exists base_custos;`;
    }

    public createCustosTable(year: number): string {
        return `
            create temporary table base_custos as
            with contratos as (
                select
                    a.pontoId,
                    a.data,
                    a.posto,
                    a.cenario as tipo_contrato,
                    b.valor as contrato
                from edp.param a inner join edp.contrato b on a.id = b.demandaId
                    where year(a.data) = ${year}
            ), demanda as (
                select
                    pontoId,
                    data,
                    posto,
                    cenario as tipo_demanda,
                    valor as demanda
                from edp.param where tipo_dado = 'DEMANDA' and year(data) = ${year}
            ), confiabilidade as (
                select
                    pontoId,
                    data,
                    posto,
                    valor as confiabilidade
                from edp.param where tipo_dado = 'CONFIABILIDADE' and year(data) = ${year}
            ), tarifa as (
                select
                    pontoId,
                    data,
                    posto,
                    valor as tarifa
                from edp.param where tipo_dado = 'TARIFA' and cenario = 'DRP' and year(data) = ${year}
            )
            select
                a.pontoId as ponto,
                a.data,
                a.posto,
                a.tipo_contrato as tipoContrato,
                b.tipo_demanda as tipoDemanda,
                a.contrato,
                b.demanda,
                c.confiabilidade,
                d.tarifa,
                a.contrato * d.tarifa/1000000 as eust,
                case
                    when b.demanda > a.contrato then d.tarifa * (b.demanda - a.contrato)/1000000
                    else 0
                end as \`add\`,
                case
                    when b.demanda > a.contrato * 1.1 then d.tarifa * (b.demanda - a.contrato) * 3/1000000
                    else 0
                end as piu
            from contratos a
                inner join demanda b on a.pontoId = b.pontoId and a.data = b.data and a.posto = b.posto
                inner join confiabilidade c on a.pontoId = c.pontoId and a.data = c.data and a.posto = c.posto
                inner join tarifa d on a.pontoId = d.pontoId and a.data = d.data and a.posto = d.posto;
        `;
    }

    public dropPisTable(): string {
        return `drop temporary table if exists pis;`;
    }

    public createPisTable(): string {
        return `
            create temporary table pis as
            select
                ponto,
                posto,
                year(data) as ano,
                tipoDemanda,
                tipoContrato,
                min(contrato) as contrato,
                max(confiabilidade) as confiabilidade,
                max(demanda) as demanda,
                max(tarifa) as tarifa,
                case 
                    when min(contrato)*0.9 - max(confiabilidade) > max(demanda) then ((min(contrato) * 0.9 - max(confiabilidade)) - max(demanda)) * 12 * max(tarifa)/1000000
                    else 0
                end as pis
            from base_custos
                group by ponto, posto, year(data), tipoDemanda, tipoContrato;
        `;
    }

    public getPenalityData(): string {
        return `
            with custos as (
                select
                    a.*,
                    coalesce(b.pis, 0) as pis,
                    coalesce(b.pis, 0) + \`add\` + piu as penalidades
                from base_custos a
                    left join pis b on (
                        a.ponto = b.ponto and
                        a.posto = b.posto and
                        month(a.data) = 12 and
                        a.tipoDemanda = b.tipoDemanda and
                        a.tipoContrato = b.tipoContrato
                    )
            )
            select * from custos where penalidades > 0 and penalidades > \`add\` order by penalidades desc;
        `;
    }

    public getPenalidadeChart(ponto: string, posto: Posto, contrato: string, demanda: string): string {
        return `
            with custos as (
                select
                    a.*,
                    coalesce(b.pis, 0) as pis,
                    coalesce(b.pis, 0) + \`add\` + piu as penalidades
                from base_custos a
                    left join pis b on (
                        a.ponto = b.ponto and
                        a.posto = b.posto and
                        month(a.data) = 12 and
                        a.tipoDemanda = b.tipoDemanda and
                        a.tipoContrato = b.tipoContrato
                    )
            )
            select * from custos where ponto = '${ponto}' and tipoContrato = '${contrato}' and tipoDemanda = '${demanda}' and posto = '${posto}' order by data asc;
        `;
    }
}