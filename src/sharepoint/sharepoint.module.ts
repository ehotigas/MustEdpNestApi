import { SharepointContratoModule } from "./contrato/sharepoint-contrato.module";
import { SharepointDemandaModule } from "./demanda/sharepoint-demanda.module";
import { SharepointParamModule } from "./params/sharepoint-param.module";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointContratoModule, SharepointDemandaModule, SharepointParamModule]
})
export class SharepointModule {

}