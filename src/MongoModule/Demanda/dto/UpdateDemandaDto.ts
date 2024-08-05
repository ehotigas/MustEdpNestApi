import { CreateDemandaDto } from "./CreateDemandaDto";
import { PartialType } from "@nestjs/swagger";

export class UpdateDemandaDto extends PartialType(CreateDemandaDto) {
    
}