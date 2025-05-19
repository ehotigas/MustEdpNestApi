import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Posto } from "src/types/posto";


export class CreateContratoDto {
    @ApiProperty({ type: Number })
    @IsNumber()
    demanda: number;

    @ApiProperty({ type: String, enum: Posto })
    posto: Posto;
    
    @ApiProperty({ type: Number, nullable: true })
    @IsNumber()
    valor: number;
}