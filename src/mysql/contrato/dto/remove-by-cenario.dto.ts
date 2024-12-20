import { ApiProperty } from "@nestjs/swagger";

export class RemoveByCenarioDto {
    @ApiProperty({ type: Boolean })
    ok: boolean;
}