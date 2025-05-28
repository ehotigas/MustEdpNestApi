import { ApiProperty } from "@nestjs/swagger";

export class ParamTable {
    @ApiProperty({ type: String })
    ponto: string;

    @ApiProperty({ type: Date })
    data: Date;

    @ApiProperty({ type: Number })
    demandaPonta: number;

    @ApiProperty({ type: Number })
    contratoPonta: number;

    @ApiProperty({ type: Number })
    demandaForaPonta: number;

    @ApiProperty({ type: Number })
    contratoForaPonta: number;
    
    @ApiProperty({ type: Number })
    contratoAnteriorPonta: number;

    @ApiProperty({ type: Number })
    contratoAnteriorForaPonta: number;
}