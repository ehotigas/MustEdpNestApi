with contratos as (
    select
        a.pontoId,
        a.data,
        a.posto,
        a.cenario as tipo_contrato,
        b.valor as contrato
    from edp.param a inner join edp.contrato b on a.id = b.demandaId
), demanda as (
    select
        pontoId,
        data,
        posto,
        cenario as tipo_demanda,
        valor as demanda
    from edp.param where tipo_dado = 'DEMANDA' and year(data) = 2025 and cenario = 'Conservador' and pontoId = 'SJC'
), confiabilidade as (
    select
        pontoId,
        data,
        posto,
        valor as confiabilidade
    from edp.param where tipo_dado = 'CONFIABILIDADE' and year(data) = 2025 and pontoId = 'SJC'
), tarifa as (
    select
        pontoId,
        data,
        posto,
        valor as tarifa
    from edp.param where tipo_dado = 'TARIFA' and cenario = 'DRP' and year(data) = 2025 and pontoId = 'SJC'
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
            when b.demanda > a.contrato * 1.1 then d.tarifa * (b.demanda - a.contrato) * 3
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
    sum(contrato)/1000 as contrato,
    sum(
        case when posto = 'Ponta' then contrato
        else 0 end
    )/1000 as contratoPonta,
    sum(
        case when posto = 'Fora Ponta' then contrato
        else 0 end
    )/1000 as contratoForaPonta,
    sum(demanda) as demanda,
    sum(valor_eust)/1000000000 as eust,
    sum(valor_add)/1000000000 as `add`,
    sum(valor_piu)/1000000000 as piu,
    sum(valor_pis)/1000000000 as pis
from custos
	group by data;