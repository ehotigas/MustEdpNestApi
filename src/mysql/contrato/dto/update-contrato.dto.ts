import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Posto } from "src/types/posto";


export class UpdateContratoDto {
    @ApiProperty({ type: String, enum: Posto })
    posto: Posto;

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsOptional()
    valor: number;
}