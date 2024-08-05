import { ApiProperty } from "@nestjs/swagger";

export class DemandaChartData {
    @ApiProperty({ type: Date })
    Data: Date;

    @ApiProperty({ type: Number })
    Demanda: number;
    
    @ApiProperty({ type: Number })
    Piu: number;
    
    @ApiProperty({ type: Number })
    Pis: number;
    
    @ApiProperty({ type: Number })
    Add: number;
    
    @ApiProperty({ type: Number })
    Eust: number;
}