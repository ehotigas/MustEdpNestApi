import { CreateContratoDto } from "./CreateContratoDto";
import { PartialType } from "@nestjs/swagger";

export class UpdateContratoDto extends PartialType(CreateContratoDto) {
    
}