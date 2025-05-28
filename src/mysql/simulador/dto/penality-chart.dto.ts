import { ApiProperty } from "@nestjs/swagger";

export class PenalityChartDto {
    @ApiProperty({ type: Date })
    data: Date;

    @ApiProperty({ type: Number })
    contrato: number;
    
    @ApiProperty({ type: Number })
    contratoPonta: number;
    
    @ApiProperty({ type: Number })
    contratoForaPonta: number;
    
    @ApiProperty({ type: Number })
    demandaPonta: number;
    
    @ApiProperty({ type: Number })
    demandaForaPonta: number;
    
    @ApiProperty({ type: Number })
    eustPonta: number;

    @ApiProperty({ type: Number })
    eustForaPonta: number;
    
    @ApiProperty({ type: Number })
    addPonta: number;

    @ApiProperty({ type: Number })
    addForaPonta: number;
    
    @ApiProperty({ type: Number })
    piuPonta: number;

    @ApiProperty({ type: Number })
    piuForaPonta: number;
    
    @ApiProperty({ type: Number })
    pisPonta: number;
    
    @ApiProperty({ type: Number })
    pisForaPonta: number;
}