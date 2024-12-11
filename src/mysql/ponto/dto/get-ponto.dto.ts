import { ApiProperty } from "@nestjs/swagger";
import { Ponto } from "../ponto.entity";


export class GetPontoDto {
    @ApiProperty({ type: [Ponto] })
    pontos: Ponto[];
}