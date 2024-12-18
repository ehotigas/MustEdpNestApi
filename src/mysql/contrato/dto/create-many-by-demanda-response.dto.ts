import { ApiProperty } from "@nestjs/swagger";

export class CreateManyByDemandaResponseDto {
    @ApiProperty({ type: Boolean })
    ok: boolean;
}