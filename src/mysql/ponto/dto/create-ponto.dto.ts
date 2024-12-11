import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Region } from "src/types/region";

export class CreatePontoDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    nome: string;

    @ApiProperty({ type: String, enum: Region })
    @IsEnum(Region)
    empresa: Region;
}