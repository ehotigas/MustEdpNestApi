import { IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/region";


export class UpdatePontoDto {
    @ApiProperty({ type: String })
    @IsOptional()
    nome: string;

    @ApiProperty({ type: String, enum: Region })
    @IsEnum(Region)
    @IsOptional()
    empresa: Region;
}