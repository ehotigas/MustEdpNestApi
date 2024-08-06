import { ApiProperty } from "@nestjs/swagger";
import { Tarifa } from "../Tarifa";

export class GetTarifaDto {
    @ApiProperty({ type: [Tarifa] })
    tarifa: Tarifa[]
}