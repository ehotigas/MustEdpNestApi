import { ApiProperty } from "@nestjs/swagger";
import { Param } from "../param.entity";


export class GetParamDto {
    @ApiProperty({ type: [Param] })
    paramList: Param[];
}