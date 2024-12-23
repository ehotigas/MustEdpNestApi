import { DemandaChart } from "../demanda-chart.entity";
import { ApiProperty } from "@nestjs/swagger";


export class GetDemandaChartDto {
    @ApiProperty({ type: [DemandaChart] })
    data: DemandaChart[];
}