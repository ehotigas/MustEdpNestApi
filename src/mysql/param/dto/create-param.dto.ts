import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DataType } from "../data-type";
import { Posto } from "src/types/posto";


export class CreateParamDto {
    @ApiProperty({ type: String })
    ponto: string;
    
    @ApiProperty({ type: String, enum: Posto })
    @IsEnum(Posto)
    posto: Posto;
    
    @ApiProperty({ type: Date })
    data: Date | string;

    @ApiProperty({ type: String, enum: DataType })
    @IsEnum(DataType)
    tipoDado: DataType;

    @ApiProperty({ type: String })
    cenario: string;

    @ApiProperty({ type: Number })
    valor: number;
}