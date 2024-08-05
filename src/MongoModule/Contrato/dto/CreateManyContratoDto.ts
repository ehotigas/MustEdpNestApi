
import { CreateContratoDto } from "./CreateContratoDto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyContratoDto {
    @ApiProperty({ type: [CreateContratoDto] })
    payload: CreateContratoDto[]
}