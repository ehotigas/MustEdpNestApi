import { Simulador } from "../simulador.entity";
import { ApiProperty } from "@nestjs/swagger";


export class GetSimuladorDataDto {
    @ApiProperty({ type: [Simulador] })
    data: Simulador[];
}