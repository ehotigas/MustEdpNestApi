import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";

export class Ciclo {
    @ApiProperty({ type: String, enum: Region })
    Empresa: Region;
    
    @ApiProperty({ type: Number })
    Ciclo: number;
    
    @ApiProperty({ type: String })
    TipoDemanda: string;
    
    @ApiProperty({ type: String })
    TipoContrato: string;
    
    @ApiProperty({ type: Number })
    ParcelaA: number;
    
    @ApiProperty({ type: Number })
    ParcelaB: number;
    
    @ApiProperty({ type: Number })
    CustoTotal: number;
    
    @ApiProperty({ type: Number })
    Total: number;
}