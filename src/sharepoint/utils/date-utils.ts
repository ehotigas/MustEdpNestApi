import { Injectable } from "@nestjs/common";


export type Mes = 'jan' | 'fev' | 'mar' | 'abr' | 'mai' | 'jun' | 'jul' | 'ago' | 'set' | 'out' | 'nov' | 'dez';

export type Ano = string;

export type DateColumn = `${Mes}/${Ano}`;

export interface IDateUtils {
    getDate(stringDate: DateColumn): string;
}


@Injectable()
export class DateUtils implements IDateUtils {
    private readonly MonthMap: Record<Mes, string> = {
        jan: "01",
        fev: "02",
        mar: "03",
        abr: "04",
        mai: "05",
        jun: "06",
        jul: "07",
        ago: "08",
        set: "09",
        out: "10",
        nov: "11",
        dez: "12",
    };
    
    public getDate(stringDate: DateColumn): string {
        const year = `20${stringDate.slice(4, 6)}`;
        const month = stringDate.slice(0, 3) as Mes;
        const integerMonth = this.MonthMap[month];
        return `${year}-${integerMonth}-01`;
    }
}