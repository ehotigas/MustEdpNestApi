export interface IContratoQueryGenerator {
    generate(year: number): string[];
}

export class ContratoQueryGenerator {
    private dropTempContrato(): string {
        return `drop temporary table if exists temp_contrato;`
    }

    private createTempContrato(year: number): string {
        return `
            create temporary table temp_contrato as
            with demanda as (
                select * from param where tipo_dado = 'DEMANDA' and year(data) = ${year}
            ), temp_contrato as (
                select
                    a.*
                from contrato a inner join demanda b on (a.demandaId = b.id)
            )
            select * from temp_contrato;
        `;
    }

    private deleteOldContratos(): string {
        return `delete contrato from edp.contrato as contrato inner join temp_contrato as temp on contrato.id = temp.id;`;
    }

    private dropRangeTable(): string {
        return `drop temporary table if exists range_contrato;`;
    }

    private dropProcedure(): string {
        return `drop procedure if exists gerar_range;`;
    }

    private createRangeTable(): string {
        return `
            create temporary table range_contrato (
                sugestao_contrato decimal(10, 1)
            );
        `;
    }

    private createProcedure(): string {
        return `
            create procedure gerar_range()
            begin
                declare valor decimal(10, 1) default 0.0;
                while valor <= 3000.0 do
                    insert into range_contrato (sugestao_contrato) values (valor);
                    set valor = valor + 0.1;
                end while;
            end;
        `;
    }
    private callProcedure(): string {
        return `call gerar_range();`;
    }

    private dropSugestaoContrato(): string {
        return `drop temporary table if exists sugestao_contrato;`;
    }

    private createSugestaoContratoTable(year: number): string {
        return `
            create temporary table sugestao_contrato as
            with tarifa as (
                select * from edp.param where tipo_dado = 'TARIFA' and cenario = 'DRP'
            ), confiabilidade as (
                select * from edp.param where tipo_dado = 'CONFIABILIDADE'
            ), demanda as (
                select * from edp.param where tipo_dado = 'DEMANDA'
            ), ultimo_contrato as (
                select
                    a.pontoId as ponto,
                    a.posto,
                    year(a.data) + 1 as ano,
                    b.valor as contrato
                from demanda a
                    inner join contrato b on a.id = b.demandaId
                    where month(a.data) = 12 and a.cenario = 'Realizado'
            ), base_parametros as (
                select
                    a.id as demanda_id,
                    a.pontoId as ponto,
                    a.posto,
                    a.data,
                    a.cenario as tipo_demanda,
                    a.valor as demanda,
                    b.valor as tarifa,
                    c.valor as confiabilidade,
                    -- d.valor as contrato,
                    e.contrato as ultimo_contrato,
                    e.contrato*0.9 as minimo_contrato
                from demanda a
                    inner join tarifa b on a.pontoId = b.pontoId and a.data = b.data and a.posto = b.posto
                    inner join confiabilidade c on a.pontoId = c.pontoId and a.data = c.data and a.posto = c.posto
                    -- inner join edp.contrato d on a.id = d.demandaId
                    inner join ultimo_contrato e on a.pontoId = e.ponto and year(a.data) = e.ano and a.posto = e.posto
                    where year(a.data) = ${year}
            ), sugestao_contrato as (
                select
                    cast(sugestao_contrato * 10 as signed) as sugestao_contrato_id,
                    a.*,
                    case
                        when b.sugestao_contrato < a.ultimo_contrato and month(a.data) <= 6 then a.ultimo_contrato
                        else b.sugestao_contrato
                    end as sugestao_contrato
                from base_parametros a
                    left join range_contrato b on (
                        a.minimo_contrato <= b.sugestao_contrato and
                        2*a.ultimo_contrato >= b.sugestao_contrato
                    )
            )
            select * from sugestao_contrato order by sugestao_contrato_id, data;
        `;
    }

    private dropPis(): string {
        return `drop temporary table if exists pis;`;
    }

    private createPisTable(): string {
        return `
            create temporary table pis as
            select
                ponto,
                posto,
                year(data) as ano,
                tipo_demanda,
                sugestao_contrato_id,
                min(sugestao_contrato) as contrato,
                max(confiabilidade) as confiabilidade,
                max(demanda) as demanda,
                max(tarifa) as tarifa,
                min(sugestao_contrato)*0.9 - max(confiabilidade) > max(demanda) as condicao_pis,
                case 
                    when min(sugestao_contrato)*0.9 - max(confiabilidade) > max(demanda) then ((min(sugestao_contrato) * 0.9 - max(confiabilidade)) - max(demanda)) * 12 * max(tarifa)
                    else 0
                end as pis
            from sugestao_contrato
                group by ponto, posto, year(data), tipo_demanda, sugestao_contrato_id;
        `;
    }

    private dropSimuladorTable(): string {
        return `drop temporary table if exists base_simulador;`
    }

    private createSimuladorTable(): string {
        return `
            create temporary table base_simulador as
            with custo as (
                select
                    a.*,
                    a.sugestao_contrato * a.tarifa as valor_eust,
                    case
                        when a.demanda > a.sugestao_contrato then a.tarifa * (a.demanda - a.sugestao_contrato)
                        else 0
                    end as valor_add,
                    case
                        when a.demanda > a.sugestao_contrato * 1.1 then a.tarifa * (a.demanda - a.sugestao_contrato) * 3
                        else 0
                    end as valor_piu,
                    coalesce(b.pis, 0) as valor_pis
                from sugestao_contrato a
                    left join pis b on (
                        a.sugestao_contrato_id = b.sugestao_contrato_id and
                        a.ponto = b.ponto and
                        a.posto = b.posto and
                        a.tipo_demanda = b.tipo_demanda and
                        year(a.data) = b.ano and
                        month(a.data) = 12
                    )
                    order by sugestao_contrato_id
            )
            select
                *,
                row_number() over (partition by ponto, posto, tipo_demanda, year(data), demanda_id order by custo_total_anual asc, sugestao_contrato desc) id
            from (
                select
                    *,
                    valor_eust + valor_add + valor_piu + valor_pis as custo_total,
                    sum(valor_eust + valor_add + valor_piu + valor_pis) over (partition by ponto, posto, tipo_demanda, year(data), sugestao_contrato_id) as custo_total_anual
                from custo
            ) a order by ponto, tipo_demanda, data;
        `;
    }

    public insertIntoContratos(): string {
        return `
            insert into contrato (valor, demandaId)
            select sugestao_contrato as valor, demanda_id as demandaId from base_simulador where id = 1 order by ponto, tipo_demanda, data;
        `;
    }


    
    public generate(year: number): string[] {
        return [
            this.dropTempContrato(),
            this.createTempContrato(year),
            this.deleteOldContratos(),
            this.dropTempContrato(),
            this.dropRangeTable(),
            this.dropProcedure(),
            this.createRangeTable(),
            this.createProcedure(),
            this.callProcedure(),
            this.dropProcedure(),
            this.dropSugestaoContrato(),
            this.createSugestaoContratoTable(year),
            this.dropPis(),
            this.createPisTable(),
            this.dropSimuladorTable(),
            this.createSimuladorTable(),
            this.insertIntoContratos(),
            this.dropRangeTable(),
            this.dropSugestaoContrato(),
            this.dropPis(),
            this.dropSimuladorTable()
        ];
    }
}
