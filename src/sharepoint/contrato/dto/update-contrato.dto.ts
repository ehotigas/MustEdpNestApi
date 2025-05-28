import { ApiProperty } from "@nestjs/swagger";

export class UpdateContratoDto {
    @ApiProperty({ type: Boolean })
    updated: boolean;

    @ApiProperty({ type: String })
    message: string;
}