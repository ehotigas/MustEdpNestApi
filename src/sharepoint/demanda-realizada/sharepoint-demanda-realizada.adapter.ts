import { SharepointDemandaTableDto } from "./dto/sharepoint-demanda-table.dto";
import { IPontoService } from "src/mysql/ponto/ponto.service";
import { DataType } from "src/mysql/param/data-type";
import { Inject, Injectable } from "@nestjs/common";
import { ICsvParser } from "../utils/csv-parser";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";
import { parse } from "date-fns";



export type DemandaTableRow = {
    Empresa: string;
    Ponto: string;
    Posto: Posto;
    MESANO: string;
    Demanda_Final: string;
    Contrato: string;
    Orçado: string;
    Tarifa: string;
    Confiabilidade: string;
};

export interface ISharepointDemandaRealizadaAdapter {
    findAll(): Promise<SharepointDemandaTableDto[]>;
}

@Injectable()
export class SharepointDemandaRealizadaAdapter implements ISharepointDemandaRealizadaAdapter {
    private readonly path: string = "C:/Users/TEMP.EDP/EDP/O365_EDPBR-ESTUDOS DE MERCADO - Acompanhamento/Painel_Temperatura/DemandaMensal.csv";
    public constructor(
        @Inject(Providers.CsvParser) private readonly csvParser: ICsvParser,
        @Inject(Providers.PontoService) private readonly pontoService: IPontoService
    ) {  }

    public async findAll(): Promise<SharepointDemandaTableDto[]> {
        const paramList: SharepointDemandaTableDto[] = [];
        const data: DemandaTableRow[] = await this.csvParser.parse(this.path);

        for (const row of data) {
            const date = parse(row.MESANO, 'dd/MM/yyyy', new Date());
            if (new Date(date).getUTCFullYear() < new Date().getUTCFullYear() - 1 || new Date(date).getUTCFullYear() > new Date().getUTCFullYear() + 2) continue;
            const ponto = await this.pontoService.findByName(row.Ponto);
            const contrato = row.Contrato ? row.Contrato.replace(",", ".") : "0";
            const orcado = row.Orçado ? row.Orçado.replace(",", ".") : "0";
            const demanda = row.Demanda_Final ? row.Demanda_Final.replace(",", ".") : "0";
            const tarifa = row.Tarifa ? row.Tarifa.replace(",", ".") : "0";
            const confiabilidade = row.Confiabilidade ? row.Confiabilidade.replace(",", ".") : "0";
            paramList.push({
                type: "contrato",
                dto: {
                    ponto: ponto.id,
                    posto: row.Posto,
                    tipoDado: DataType.DEMANDA,
                    data: date,
                    cenario: 'Contrato',
                    valor: parseFloat(contrato)
                }
            });
            paramList.push({
                type: "contrato",
                dto: {
                    ponto: ponto.id,
                    posto: row.Posto,
                    tipoDado: DataType.DEMANDA,
                    data: date,
                    cenario: 'Orçado',
                    valor: parseFloat(orcado)
                }
            });
            paramList.push({
                type: "param",
                dto: {
                    ponto: ponto.id,
                    posto: row.Posto,
                    tipoDado: DataType.DEMANDA,
                    data: date,
                    cenario: 'Realizado',
                    valor: parseFloat(demanda)
                }
            });
            paramList.push({
                type: "param",
                dto: {
                    ponto: ponto.id,
                    posto: row.Posto,
                    tipoDado: DataType.TARIFA,
                    data: date,
                    cenario: 'DRP',
                    valor: parseFloat(tarifa)
                }
            });
            paramList.push({
                type: "param",
                dto: {
                    ponto: ponto.id,
                    posto: row.Posto,
                    tipoDado: DataType.CONFIABILIDADE,
                    data: date,
                    cenario: '',
                    valor: parseFloat(confiabilidade)
                }
            });
        }
        return paramList;
    }
}