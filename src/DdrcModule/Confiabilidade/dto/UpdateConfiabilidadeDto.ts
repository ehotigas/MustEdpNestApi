import { CreateConfiabilidadeDto } from "./CreateConfiabilidadeDto";
import { PartialType } from "@nestjs/swagger";

export class UpdateConfiabilidadeDto extends PartialType(CreateConfiabilidadeDto) {
    
}