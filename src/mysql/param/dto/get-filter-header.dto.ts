import { ApiProperty } from "@nestjs/swagger";

export class GetFilterHeaderDto {
    @ApiProperty({ type: [String] })
    ano: string[];
    
    @ApiProperty({ type: [String] })
    cenario: string[]
}