import { ApiProperty } from "@nestjs/swagger";

export class DemandaChart {
    @ApiProperty({ type: Date })
    data: Date;

    @ApiProperty({ type: String })
    cenario: string;

    @ApiProperty({ type: Number })
    demanda: number;
}