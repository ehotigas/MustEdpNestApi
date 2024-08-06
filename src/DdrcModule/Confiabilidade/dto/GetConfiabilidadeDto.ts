import { ApiProperty } from "@nestjs/swagger";
import { Confiabilidade } from "../Confiabilidade";

export class GetConfiabilidadeDto {
    @ApiProperty({ type: [Confiabilidade] })
    confiabilidade: Confiabilidade[]
}