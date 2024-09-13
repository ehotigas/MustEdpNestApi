import { ApiProperty } from "@nestjs/swagger";

export class CustosChartData {
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
    
    @ApiProperty({ type: Number, nullable: true })
    Total?: number;
}