import { ApiProperty } from "@nestjs/swagger";
import { Posto } from "src/types/posto";


export class SimuladorContratoTable {
    @ApiProperty({ type: String })
    nomePonto: string;
    
    @ApiProperty({ type: String })
    ponto: string;
    
    @ApiProperty({ type: String, enum: Posto })
    posto: Posto;
    
    @ApiProperty({ type: Number })
    data: number;
    
    @ApiProperty({ type: String })
    cenario: string;
    
    @ApiProperty({ type: Number })
    contratoPonta: number;
    
    @ApiProperty({ type: Number })
    demandaPonta: number;
    
    @ApiProperty({ type: Number })
    contratoForaPonta: number;
    
    @ApiProperty({ type: Number })
    demandaForaPonta: number;
}