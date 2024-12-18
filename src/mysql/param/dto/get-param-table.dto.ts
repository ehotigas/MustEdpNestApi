import { ApiProperty } from "@nestjs/swagger";
import { ParamTable } from "../param-table";

export class GetParamTableDto {
    @ApiProperty({ type: [ParamTable] })
    table: ParamTable[];
}