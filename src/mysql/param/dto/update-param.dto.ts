import { CreateParamDto } from "./create-param.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateParamDto extends PartialType(CreateParamDto) {

}