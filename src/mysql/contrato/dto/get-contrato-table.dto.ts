import { ContratoTable } from "../contrato-table.entity";
import { ApiProperty } from "@nestjs/swagger";


export class GetContratoTableDto {
    @ApiProperty({ type: [ContratoTable] })
    data: ContratoTable[];
}