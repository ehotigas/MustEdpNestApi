import { ApiProperty } from "@nestjs/swagger";

export class ContratoTable {
    @ApiProperty({ type: String })
    ponto: string;
    
    @ApiProperty({ type: Date })
    data: Date;
    
    @ApiProperty({ type: Number })
    contrato: number;
    
    @ApiProperty({ type: Number })
    contratoPonta: number;
    
    @ApiProperty({ type: Number })
    contratoForaPonta: number;
    
    @ApiProperty({ type: Number })
    demandaPonta: number;
    
    @ApiProperty({ type: Number })
    demandaForaPonta: number;
    
    @ApiProperty({ type: Number })
    demanda: number;
    
    @ApiProperty({ type: Number })
    ultimoContratoPonta: number;
    
    @ApiProperty({ type: Number })
    ultimoContratoForaPonta: number;
}