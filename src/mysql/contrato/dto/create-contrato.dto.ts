import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class CreateContratoDto {
    @ApiProperty({ type: Number })
    @IsNumber()
    demanda: number;
    
    @ApiProperty({ type: Number, nullable: true })
    @IsNumber()
    valor: number;
}