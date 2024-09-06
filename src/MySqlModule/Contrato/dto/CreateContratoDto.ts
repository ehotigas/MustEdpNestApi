import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export class CreateContratoDto {
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
    TipoContrato: string;
    
    @ApiProperty({ type: Number })
    Contrato: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    Empresa: Region;
}