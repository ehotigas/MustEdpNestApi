import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";

export class SharepointDemandaTableDto {
    type: "param" | "contrato";
    dto: CreateParamDto;
}