import { ApiProperty } from "@nestjs/swagger";

export class Simulador {
    @ApiProperty({ type: String })
    tipoContrato: string;
    
    @ApiProperty({ type: String })
    tipo_Demanda: string;
    
    @ApiProperty({ type: Number })
    contrato: number;
    
    @ApiProperty({ type: Number })
    contratoPonta: number;
    
    @ApiProperty({ type: Number })
    contratoForaPonta: number;
    
    @ApiProperty({ type: Number })
    demanda: number;
    
    @ApiProperty({ type: Number })
    eust: number;
    
    @ApiProperty({ type: Number })
    add: number;
    
    @ApiProperty({ type: Number })
    penalidades: number;
    
    @ApiProperty({ type: Number })
    total: number;
}