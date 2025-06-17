import { Region } from "src/types/region";

export interface ISimuladorQueryBuilder {
    generate(year: number): string[];
    dropBaseCustos(): string;
    createBaseCustos(year: number): string;
    dropTablePis(): string;
    createTablePis(): string;
    getSimuladorData(region: Region): string;
}

export class SimuladorQueryBuilder {
    public dropBaseCustos(): string {
        return `drop temporary table if exists base_custos;`;
    }

    public createBaseCustos(year: number): string {
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
                        where year(a.data) = ${year} and a.cenario != 'Realizado' and a.cenario != 'Orçado'
                ), demanda as (
                    select
                        pontoId,
                        data,
                        posto,
                        cenario as tipo_demanda,
                        valor as demanda
                    from edp.param where tipo_dado = 'DEMANDA' and year(data) = ${year} and cenario != 'Realizado' and cenario != 'Orçado'
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
                    inner join tarifa d on a.pontoId = d.pontoId and a.data = d.data and a.posto = d.posto;
        `;
    }

    public dropTablePis(): string {
        return `drop temporary table if exists pis;`;
    }

    public createTablePis(): string {
        return `
            create temporary table pis as
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
                from base_custos
                    group by ponto, posto, year(data), tipo_demanda, tipo_contrato;
        `;
    }

    public getSimuladorData(region: Region): string {
        return `
            with custos as (
                    select
                        a.*,
                        coalesce(b.pis, 0) as valor_pis,
                        coalesce(b.pis, 0) + valor_add + valor_piu as valor_penalidades
                    from base_custos a
                        left join pis b on (
                            a.ponto = b.ponto and
                            a.posto = b.posto and
                            month(a.data) = 12 and
                            a.tipo_demanda = b.tipo_demanda and
                            a.tipo_contrato = b.tipo_contrato
                        )
                        inner join edp.ponto c on a.ponto = c.id and c.empresa = '${region}'
                )
                select
                    -- ponto,
                    -- posto,
                    tipo_contrato as tipoContrato,
                    tipo_demanda as tipoDemanda,
                    sum(contrato) as contrato,
                    sum(
                        case when posto = 'Ponta' then contrato
                        else 0 end
                    ) as contratoPonta,
                    sum(
                        case when posto = 'Fora Ponta' then contrato
                        else 0 end
                    ) as contratoForaPonta,
                    sum(demanda) as demanda,
                    sum(valor_eust)/1000000 as eust,
                    sum(valor_add)/1000000 as \`add\`,
                    sum(valor_penalidades)/1000000 as penalidades,
                    sum(valor_penalidades + valor_eust)/1000000 as total
                from custos
                    group by tipo_contrato, tipo_demanda
                    order by tipo_contrato, tipo_demanda;
        `;
    }

    public generate(year: number, region: Region): string[] {
        return [
            this.dropBaseCustos(),
            this.createBaseCustos(year),
            this.dropTablePis(),
            this.createTablePis(),
            this.getSimuladorData(region),
            this.dropBaseCustos(),
            this.dropTablePis(),
        ];
    }
}