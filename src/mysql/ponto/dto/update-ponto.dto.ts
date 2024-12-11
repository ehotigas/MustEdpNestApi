import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/region";
import { IsEnum } from "class-validator";


export class UpdatePontoDto {
    @ApiProperty({ type: String })
    nome: string;

    @ApiProperty({ type: String, enum: Region })
    @IsEnum(Region)
    empresa: Region;
}