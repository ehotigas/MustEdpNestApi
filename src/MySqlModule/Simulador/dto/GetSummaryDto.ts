import { ApiProperty } from "@nestjs/swagger";
import { SummaryData } from "../SummaryData";

export class GetSummaryDto {
    @ApiProperty({ type: [SummaryData] })
    summary: SummaryData[];
}