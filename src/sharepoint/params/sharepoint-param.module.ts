import { SharepointParamController } from "./sharepoint-param.controller";
import { SharepointUtilsModule } from "../utils/sharepoint-utils.module";
import { SharepointParamAdapter } from "./sharepoint-param.adapter";
import { SharepointParamService } from "./sharepoint-param.service";
import { ParamModule } from "src/mysql/param/param.module";
import { PontoModule } from "src/mysql/ponto/ponto.module";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";


@Module({
    imports: [SharepointUtilsModule, ParamModule, PontoModule],
    controllers:[SharepointParamController],
    providers: [
        { provide: Providers.SharepointParamAdapter, useClass: SharepointParamAdapter },
        { provide: Providers.SharepointParamService, useClass: SharepointParamService }
    ]
})
export class SharepointParamModule {
    
}