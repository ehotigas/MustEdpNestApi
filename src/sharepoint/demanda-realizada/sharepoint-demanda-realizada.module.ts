import { SharepointDemandaRealizadaAdapter } from "./sharepoint-demanda-realizada.adapter";
import { SharepointDemandaRealizadaController } from "./sharepoint-demanda-realizada.controller";
import { SharepointDemandaRealizadaService } from "./sharepoint-demanda-realizada.service";
import { SharepointUtilsModule } from "../utils/sharepoint-utils.module";
import { ContratoModule } from "src/mysql/contrato/contrato.module";
import { ParamModule } from "src/mysql/param/param.module";
import { PontoModule } from "src/mysql/ponto/ponto.module";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointUtilsModule, ParamModule, ContratoModule, PontoModule],
    controllers:[SharepointDemandaRealizadaController],
    providers: [
        { provide: Providers.SharepointDemandaRealizadaAdapter, useClass: SharepointDemandaRealizadaAdapter },
        { provide: Providers.SharepointDemandaRealizadaService, useClass: SharepointDemandaRealizadaService }
    ]
})
export class SharepointDemandaRealizadaModule {
    
}