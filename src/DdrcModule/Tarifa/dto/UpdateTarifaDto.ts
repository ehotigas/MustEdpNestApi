import { PartialType } from "@nestjs/swagger";
import { CreateTarifaDto } from "./CreateTarifaDto";

export class UpdateTarifaDto extends PartialType(CreateTarifaDto) {
    
}