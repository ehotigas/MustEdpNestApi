import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Posto } from "src/types/posto";

export class CreateByDemandaDto {
    @ApiProperty({ type: String })
    ponto: string;
    
    @ApiProperty({ type: String, enum: Posto })
    @IsEnum(Posto)
    posto: Posto;
    
    @ApiProperty({ type: Date })
    data: Date;

    @ApiProperty({ type: String })
    cenario: string;

    @ApiProperty({ type: Number })
    valor: number;
}