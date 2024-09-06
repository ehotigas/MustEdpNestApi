import { CreateConfiabilidadeDto } from "./CreateConfiabilidadeDto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyConfiabilidadeDto {
    @ApiProperty({ type: [CreateConfiabilidadeDto] })
    payload: CreateConfiabilidadeDto[]
}