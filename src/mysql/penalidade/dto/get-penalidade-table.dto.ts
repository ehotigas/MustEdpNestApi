import { ApiProperty } from "@nestjs/swagger";
import { Penalidade } from "../penalidade.entity";


export class GetPenalidadeTableDto {
    @ApiProperty({ type: [Penalidade] })
    data: Penalidade[];
}