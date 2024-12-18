import { ApiProperty } from "@nestjs/swagger";

export class CreateManyParamResponseDto {
    @ApiProperty({ type: Boolean })
    ok: boolean;
}