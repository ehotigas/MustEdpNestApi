import { ApiProperty } from "@nestjs/swagger";
import { Posto } from "src/types/Posto";

export class GetSimuladorFiltersDto {
    @ApiProperty({ type: String })
    TipoDemanda: String;
    
    @ApiProperty({ type: String })
    Ponto: String;
    
    @ApiProperty({ type: String, enum: Posto })
    Posto: Posto;
    
    @ApiProperty({ type: String })
    Ano: string;

    @ApiProperty({ type: String })
    TipoContrato?: string;
}