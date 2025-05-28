import { SharepointContratoController } from "./sharepoint-contrato.controller";
import { SharepointContratoAdapter } from "./sharepoint-contrato.adapter";
import { SharepointContratoService } from "./sharepoint-contrato.service";
import { SharepointUtilsModule } from "../utils/sharepoint-utils.module";
import { ContratoModule } from "src/mysql/contrato/contrato.module";
import { PontoModule } from "src/mysql/ponto/ponto.module";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointUtilsModule, ContratoModule, PontoModule],
    controllers:[SharepointContratoController],
    providers: [
        { provide: Providers.SharepointContratoAdapter, useClass: SharepointContratoAdapter },
        { provide: Providers.SharepointContratoService, useClass: SharepointContratoService }
    ]
})
export class SharepointContratoModule {
    
}