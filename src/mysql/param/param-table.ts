import { ApiProperty } from "@nestjs/swagger";

export class ParamTable {
    @ApiProperty({ type: String })
    ponto: string;

    @ApiProperty({ type: Date })
    data: Date;

    @ApiProperty({ type: Number })
    demandaPonta: number;

    @ApiProperty({ type: Number })
    demandaForaPonta: number;

    @ApiProperty({ type: Number })
    confiabilidadePonta: number;

    @ApiProperty({ type: Number })
    confiabilidadeForaPonta: number;
    
    @ApiProperty({ type: Number })
    draPonta: number;

    @ApiProperty({ type: Number })
    draForaPonta: number;
    
    @ApiProperty({ type: Number })
    drpPonta: number;

    @ApiProperty({ type: Number })
    drpForaPonta: number;
}