import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateContratoDto {
    @ApiProperty({ type: Number })
    @IsNumber()
    @IsOptional()
    valor: number;
}