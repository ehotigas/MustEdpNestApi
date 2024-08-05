import { CreateTarifaDto } from "./CreateTarifaDto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyTarifaDto {
    @ApiProperty({ type: [CreateTarifaDto] })
    payload: CreateTarifaDto[]
}