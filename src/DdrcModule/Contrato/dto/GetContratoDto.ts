import { ApiProperty } from "@nestjs/swagger";
import { Contrato } from "../Contrato";

export class GetContratoDto {
    @ApiProperty({ type: [Contrato] })
    contrato: Contrato[]
}