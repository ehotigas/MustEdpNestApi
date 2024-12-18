import { ApiProperty } from "@nestjs/swagger";
import { CreateParamDto } from "./create-param.dto";

export class CreateManyParamDto {
    @ApiProperty({ type: [CreateParamDto] })
    payload: CreateParamDto[];
}