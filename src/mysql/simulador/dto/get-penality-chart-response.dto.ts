import { ApiProperty } from "@nestjs/swagger";
import { PenalityChartDto } from "./penality-chart.dto";

export class GetPenalityChartResponseDto {
    @ApiProperty({ type: [PenalityChartDto] })
    data: PenalityChartDto[];
}