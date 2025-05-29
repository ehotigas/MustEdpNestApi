import { SharepointDemandaRealizadaModule } from "./demanda-realizada/sharepoint-demanda-realizada.module";
import { SharepointContratoModule } from "./contrato/sharepoint-contrato.module";
import { SharepointDemandaModule } from "./demanda/sharepoint-demanda.module";
import { SharepointParamModule } from "./params/sharepoint-param.module";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointContratoModule, SharepointDemandaModule, SharepointDemandaRealizadaModule, SharepointParamModule]
})
export class SharepointModule {

}