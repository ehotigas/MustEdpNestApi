import { CustosChartData } from "../CustosChartData";
import { ApiProperty } from "@nestjs/swagger";

export class GetPenalidadeChartDataDto {
    @ApiProperty({ type: [CustosChartData] })
    data: CustosChartData[];
}