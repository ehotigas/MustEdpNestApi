import { DemandaChartData } from "../DemandaChartData";
import { ApiProperty } from "@nestjs/swagger";

export class GetDemandaChartDataDto {
    @ApiProperty({ type: [DemandaChartData] })
    data: DemandaChartData[];
}