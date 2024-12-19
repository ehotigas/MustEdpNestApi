import { ApiProperty } from "@nestjs/swagger";

export class RemoveDemandaByCenarioDto {
    @ApiProperty({ type: Boolean })
    ok: boolean;
}