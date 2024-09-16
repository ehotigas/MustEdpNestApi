import { ApiProperty } from "@nestjs/swagger";
import { ParcelaAB } from "../ParcelaAB";

export class GetParcelaABDto {
    @ApiProperty({ type: [ParcelaAB] })
    data: ParcelaAB[];
}