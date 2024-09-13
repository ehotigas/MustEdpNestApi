import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region"

export class SummaryData {
    @ApiProperty({ type: String, enum: Region })
    Empresa: Region;

    @ApiProperty({ type: Date })
    Data: Date;

    @ApiProperty({ type: String })
    TipoDemanda: string;

    @ApiProperty({ type: String })
    TipoContrato: string;

    @ApiProperty({ type: Number })
    Contrato: number;

    @ApiProperty({ type: Number })
    Piu: number;

    @ApiProperty({ type: Number })
    Add: number;

    @ApiProperty({ type: Number })
    Eust: number;

    @ApiProperty({ type: Number })
    Pis: number;

    @ApiProperty({ type: Number })
    Dra: number;

    @ApiProperty({ type: Number })
    Drp: number;

    @ApiProperty({ type: Number })
    ParcelaA: number;

    @ApiProperty({ type: Number })
    ParcelaB: number;
}