import { ApiProperty } from "@nestjs/swagger";
import { Posto } from "src/types/posto";

export class Penalidade {
    @ApiProperty({ type: String })
    ponto: string;
    
    @ApiProperty({ type: Date })
    data: Date;
    
    @ApiProperty({ type: String, enum: Posto })
    posto: Posto;
    
    @ApiProperty({ type: String })
    tipoContrato: string;
    
    @ApiProperty({ type: String })
    tipoDemanda: string;
    
    @ApiProperty({ type: Number })
    contrato: number;
    
    @ApiProperty({ type: Number })
    demanda: number;
    
    @ApiProperty({ type: Number })
    confiabilidade: number;
    
    @ApiProperty({ type: Number })
    tarifa: number;
    
    @ApiProperty({ type: Number })
    eust: number;
    
    @ApiProperty({ type: Number })
    add: number;
    
    @ApiProperty({ type: Number })
    piu: number;
    
    @ApiProperty({ type: Number })
    pis: number;
    
    @ApiProperty({ type: Number })
    penalidades: number;
}