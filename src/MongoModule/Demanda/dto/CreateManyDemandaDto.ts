
import { CreateDemandaDto } from "./CreateDemandaDto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyDemandaDto {
    @ApiProperty({ type: [CreateDemandaDto] })
    payload: CreateDemandaDto[]
}