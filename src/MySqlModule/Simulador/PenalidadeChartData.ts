import { ApiProperty } from "@nestjs/swagger";

export class PenalidadeChartData {
    @ApiProperty({ type: String })
    TipoContrato: string;
    @ApiProperty({ type: Number, nullable: true })
    Piu?: number;
    @ApiProperty({ type: Number, nullable: true })
    Pis?: number;
    @ApiProperty({ type: Number, nullable: true })
    Add?: number;
    @ApiProperty({ type: Number, nullable: true })
    Eust?: number;
}