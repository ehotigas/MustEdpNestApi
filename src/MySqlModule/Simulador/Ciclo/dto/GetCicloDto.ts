import { ApiProperty } from "@nestjs/swagger";
import { Ciclo } from "../Ciclo";

export class GetCicloDto {
    @ApiProperty({ type: [Ciclo] })
    data: Ciclo[];
}