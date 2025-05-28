import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { IPontoService } from "src/mysql/ponto/ponto.service";
import { DateColumn, IDateUtils } from "../utils/date-utils";
import { DataType } from "src/mysql/param/data-type";
import { Inject, Injectable } from "@nestjs/common";
import { ICsvParser } from "../utils/csv-parser";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";


export type DemandaTableRow = {
    EMPRESA: string;
    Tipo: string;
    TIPO: string;
    Ponto: string;
    Posto: Posto;
    Cenario: string;
} & {
    [K in DateColumn]: string;
}

export interface ISharepointDemandaAdapter {
    findAll(): Promise<CreateParamDto[]>;
}

@Injectable()
export class SharepointDemandaAdapter implements ISharepointDemandaAdapter {
    private readonly path: string = "C:/Users/E707929/OneDrive - EDP/Documents/Demandas_v2.csv";
    public constructor(
        @Inject(Providers.CsvParser) private readonly csvParser: ICsvParser,
        @Inject(Providers.PontoService) private readonly pontoService: IPontoService,
        @Inject(Providers.DateUtils) private readonly dateUtils: IDateUtils
    ) {  }

    public async findAll(): Promise<CreateParamDto[]> {
        const paramList: CreateParamDto[] = [];
        const data: DemandaTableRow[] = await this.csvParser.parse(this.path);
        
        for (const row of data) {
            const rowKeys = Object.keys(row);
            for (const columnName of rowKeys) {
                const regex = /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{2}$/;
                if (regex.test(columnName)) {
                    const value = row[columnName] ? (row[columnName] as string).toString().replace(",", ".") : "0";
                    const date = this.dateUtils.getDate(columnName as DateColumn);
                    if (new Date(date).getUTCFullYear() < new Date().getUTCFullYear() - 1 || new Date(date).getUTCFullYear() > new Date().getUTCFullYear() + 2) continue;
                    const ponto = await this.pontoService.findByName(row.Ponto);
                    paramList.push({
                        ponto: ponto.id,
                        posto: row.Posto,
                        tipoDado: DataType.DEMANDA,
                        data: date,
                        cenario: row.Cenario,
                        valor: parseFloat(value)
                    });
                }
            }
        }
        return paramList;
    }
}