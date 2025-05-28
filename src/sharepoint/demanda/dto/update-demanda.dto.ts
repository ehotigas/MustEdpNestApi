import { ApiProperty } from "@nestjs/swagger";

export class UpdateDemandaDto {
    @ApiProperty({ type: Boolean })
    updated: boolean;

    @ApiProperty({ type: String })
    message: string;
}