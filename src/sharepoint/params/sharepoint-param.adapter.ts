import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { IPontoService } from "src/mysql/ponto/ponto.service";
import { DateColumn, IDateUtils } from "../utils/date-utils";
import { DataType } from "src/mysql/param/data-type";
import { Inject, Injectable } from "@nestjs/common";
import { ICsvParser } from "../utils/csv-parser";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";


export type ContratoTableRow = {
    Empresa: string;
    'Interligação': string;
    Posto: Posto;
    Tipo: "Confiabilidade" | "Real" | "Contrato" | "Orçado" | "Tarifa";
} & {
    [K in DateColumn]: string;
}

export interface ISharepointParamAdapter {
    findAll(): Promise<CreateParamDto[]>;
}

@Injectable()
export class SharepointParamAdapter implements ISharepointParamAdapter {
    private readonly path: string = "C:/Users/TEMP.EDP/EDP/O365_EDPBR-ESTUDOS DE MERCADO - Acompanhamento/Painel_Temperatura/MUSTDeparasContrato.csv";
    public constructor(
        @Inject(Providers.CsvParser) private readonly csvParser: ICsvParser,
        @Inject(Providers.PontoService) private readonly pontoService: IPontoService,
        @Inject(Providers.DateUtils) private readonly dateUtils: IDateUtils
    ) {  }

    private formatCenario(row: ContratoTableRow): string {
        switch (row.Tipo) {
            case "Confiabilidade": return "";
            case "Tarifa": return "DRP";
            case "Real": return "Realizado";
            default: return null;
        }
    }

    private formatDataType(row: ContratoTableRow): DataType {
        switch (row.Tipo) {
            case "Confiabilidade": return DataType.CONFIABILIDADE;
            case "Tarifa": return DataType.TARIFA;
            // case "Real": return DataType.DEMANDA;
            default: return null;
        }
    }

    public async findAll(): Promise<CreateParamDto[]> {
        const paramList: CreateParamDto[] = [];
        const data: ContratoTableRow[] = await this.csvParser.parse(this.path);
        
        for (const row of data) {
            const rowKeys = Object.keys(row);
            if (row.Tipo == "Contrato" || row.Tipo == "Orçado" || row.Tipo == "Real") continue;
            for (const columnName of rowKeys) {
                const regex = /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{2}$/;
                if (regex.test(columnName)) {
                    const value = row[columnName] ? (row[columnName] as string).toString().replace(",", ".") : "0";
                    const date = this.dateUtils.getDate(columnName as DateColumn);
                    if (new Date(date).getUTCFullYear() < new Date().getUTCFullYear() - 1 || new Date(date).getUTCFullYear() > new Date().getUTCFullYear() + 2) continue;
                    const ponto = await this.pontoService.findByName(row.Interligação);
                    paramList.push({
                        ponto: ponto.id,
                        posto: row.Posto,
                        tipoDado: this.formatDataType(row),
                        data: date,
                        cenario: this.formatCenario(row),
                        valor: parseFloat(value)
                    });
                }
            }
        }
        return paramList;
    }
}