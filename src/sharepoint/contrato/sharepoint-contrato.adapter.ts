import { CreateByDemandaDto } from "src/mysql/contrato/dto/create-by-demanda.dto";
import { IPontoService } from "src/mysql/ponto/ponto.service";
import { DateColumn, IDateUtils } from "../utils/date-utils";
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

export interface ISharepointContratoAdapter {
    findAll(): Promise<CreateByDemandaDto[]>;
}

@Injectable()
export class SharepointContratoAdapter implements ISharepointContratoAdapter {
    private readonly path: string = "C:/Users/TEMP.EDP/EDP/O365_EDPBR-ESTUDOS DE MERCADO - Acompanhamento/Painel_Temperatura/MUSTDeparasContrato.csv";
    public constructor(
        @Inject(Providers.CsvParser) private readonly csvParser: ICsvParser,
        @Inject(Providers.PontoService) private readonly pontoService: IPontoService,
        @Inject(Providers.DateUtils) private readonly dateUtils: IDateUtils
    ) {  }

    private formatCenario(row: ContratoTableRow): string {
        switch (row.Tipo) {
            case "Contrato": return "Contrato";
            case "Orçado": return "Orçado";
            default: return null;
        }
    }

    public async findAll(): Promise<CreateByDemandaDto[]> {
        const contratoList: CreateByDemandaDto[] = [];
        const data: ContratoTableRow[] = await this.csvParser.parse(this.path);
        
        for (const row of data) {
            const rowKeys = Object.keys(row);
            if (!["Contrato", "Orçado"].includes(row.Tipo)) continue;
            for (const columnName of rowKeys) {
                const regex = /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{2}$/;
                if (regex.test(columnName)) {
                    const value = row[columnName] ? (row[columnName] as string).toString().replace(",", ".") : "0";
                    const date = this.dateUtils.getDate(columnName as DateColumn);
                    if (new Date(date).getUTCFullYear() < new Date().getUTCFullYear() - 1 || new Date(date).getUTCFullYear() > new Date().getUTCFullYear() + 2) continue;
                    const ponto = await this.pontoService.findByName(row.Interligação);
                    contratoList.push({
                        ponto: ponto.id,
                        posto: row.Posto,
                        data: date,
                        cenario: this.formatCenario(row),
                        valor: parseFloat(value)
                    });
                }
            }
        }
        return contratoList;
    }
}