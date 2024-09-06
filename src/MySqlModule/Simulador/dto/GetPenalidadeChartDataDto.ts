import { PenalidadeChartData } from "../PenalidadeChartData";
import { ApiProperty } from "@nestjs/swagger";

export class GetPenalidadeChartDataDto {
    @ApiProperty({ type: [PenalidadeChartData] })
    data: PenalidadeChartData[];
}