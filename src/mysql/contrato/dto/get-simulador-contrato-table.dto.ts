import { SimuladorContratoTable } from "../simulador-contrato-table.entity";
import { ApiProperty } from "@nestjs/swagger";


export class GetSimuladorContratoTableDto {
    @ApiProperty({ type: [SimuladorContratoTable] })
    data: SimuladorContratoTable[];
}