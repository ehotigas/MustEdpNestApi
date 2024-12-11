import { ParamController } from "./param.controller";
import { PontoModule } from "../ponto/ponto.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, Param } from "@nestjs/common";
import { ParamAdapter } from "./param.adapter";
import { ParamService } from "./param.service";
import { Ponto } from "../ponto/ponto.entity";
import { Providers } from "src/providers";


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
    ]
})
export class ParamModule {

}