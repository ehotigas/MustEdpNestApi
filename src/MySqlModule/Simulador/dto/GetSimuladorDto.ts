import { ApiProperty } from "@nestjs/swagger";
import { Simulador } from "../Simulador";

export class GetSimuladorDto {
    @ApiProperty({ type: [Simulador] })
    data: Simulador[];
}