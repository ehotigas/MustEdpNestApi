import { CreateByDemandaDto } from "./create-by-demanda.dto";
import { ApiProperty } from "@nestjs/swagger";


export class CreateManyByDemandaDto {
    @ApiProperty({ type: [CreateByDemandaDto] })
    payload: CreateByDemandaDto[];
}