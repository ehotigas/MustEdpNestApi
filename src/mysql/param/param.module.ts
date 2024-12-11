import { ParamController } from "./param.controller";
import { PontoModule } from "../ponto/ponto.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParamAdapter } from "./param.adapter";
import { ParamService } from "./param.service";
import { Ponto } from "../ponto/ponto.entity";
import { Providers } from "src/providers";
import { Module } from "@nestjs/common";
import { Param } from "./param.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Param, Ponto ]),
        PontoModule
    ],
    controllers: [ ParamController ],
    providers: [
        {
            provide: Providers.ParamAdapter,
            useClass: ParamAdapter
        },
        {
            provide: Providers.ParamService,
            useClass: ParamService
        }
    ],
    exports: [ Providers.ParamService ]
})
export class ParamModule {

}