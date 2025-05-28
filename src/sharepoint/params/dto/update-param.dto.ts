import { ApiProperty } from "@nestjs/swagger";

export class UpdateParamDto {
    @ApiProperty({ type: Boolean })
    updated: boolean;

    @ApiProperty({ type: String })
    message: string;
}