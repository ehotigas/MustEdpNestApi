import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";

export class GetSummaryFiltersDto {
    @ApiProperty({ type: String })
    TipoDemanda: string;
    
    @ApiProperty({ type: String })
    TipoContrato: string;

    @ApiProperty({ type: String, enum: Region })
    Empresa: Region;
}