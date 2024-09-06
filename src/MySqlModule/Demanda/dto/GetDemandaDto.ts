import { ApiProperty } from "@nestjs/swagger";
import { Demanda } from "../Demanda";

export class GetDemandaDto {
    @ApiProperty({ type: [Demanda] })
    demanda: Demanda[]
}