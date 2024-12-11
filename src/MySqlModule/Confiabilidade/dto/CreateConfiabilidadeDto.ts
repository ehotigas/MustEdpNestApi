import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/region";
import { Posto } from "src/types/posto";

export class CreateConfiabilidadeDto {
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
    Confiabilidade: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    Empresa: Region;
}