import { ApiProperty } from "@nestjs/swagger";

export class GenerateContractDto {
    @ApiProperty({ type: String })
    message: string;
}