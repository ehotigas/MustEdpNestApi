import { ApiProperty } from "@nestjs/swagger";

export class GetContratoTableFilterDto {
    @ApiProperty({ type: [String] })
    ano: string[];
    
    @ApiProperty({ type: [String] })
    cenario: string[]
}