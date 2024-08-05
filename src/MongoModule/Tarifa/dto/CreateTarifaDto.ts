import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export class CreateTarifaDto {
    @ApiProperty({ type: String })
    Ponto: string;
    
    @ApiProperty({
        type: String,
        enum: Posto
    })
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    Data: Date;
    
    @ApiProperty({ type: Number })
    Tarifa: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    Empresa: Region;
}