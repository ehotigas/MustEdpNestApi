import { SharepointDemandaController } from "./sharepoint-demanda.controller";
import { SharepointUtilsModule } from "../utils/sharepoint-utils.module";
import { SharepointDemandaAdapter } from "./sharepoint-demanda.adapter";
import { SharepointDemandaService } from "./sharepoint-demanda.service";
import { ParamModule } from "src/mysql/param/param.module";
import { PontoModule } from "src/mysql/ponto/ponto.module";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointUtilsModule, ParamModule, PontoModule],
    controllers:[SharepointDemandaController],
    providers: [
        { provide: Providers.SharepointDemandaAdapter, useClass: SharepointDemandaAdapter },
        { provide: Providers.SharepointDemandaService, useClass: SharepointDemandaService }
    ]
})
export class SharepointDemandaModule {
    
}