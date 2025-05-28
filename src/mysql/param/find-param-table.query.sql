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
    left join contrato_anterior f on a.data = f.data and a.ponto = f.ponto and f.posto = 'Ponta'
    left join contrato_anterior g on a.data = g.data and a.ponto = g.ponto and g.posto = 'Fora Ponta'
    order by a.data asc;