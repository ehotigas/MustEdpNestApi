import { ApiProperty } from "@nestjs/swagger";
import { SummaryData } from "../Resumo/SummaryData";

export class GetSummaryDto {
    @ApiProperty({ type: [SummaryData] })
    summary: SummaryData[];
}