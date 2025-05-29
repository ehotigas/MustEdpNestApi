import { ApiProperty } from "@nestjs/swagger";

export class UpdateDemandaRealizadaDto {
    @ApiProperty({ type: Boolean })
    updated: boolean;

    @ApiProperty({ type: String })
    message: string;
}