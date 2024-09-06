import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export class CreateDemandaDto {
    @ApiProperty({ type: String })
    Ponto: string;
    
    @ApiProperty({
        type: String,
        enum: Posto
    })
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    Data: Date;

    @ApiProperty({ type: String })
    TipoDemanda: string;
    
    @ApiProperty({ type: Number })
    Demanda: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    Empresa: Region;
}