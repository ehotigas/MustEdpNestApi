import { ContratoQueryGenerator } from "./contrato-sql-query";
import { ContratoController } from "./contrato.controller";
import { ContratoAdapter } from "./contrato.adapter";
import { ContratoService } from "./contrato.service";
import { ParamModule } from "../param/param.module";
import { PontoModule } from "../ponto/ponto.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, Param } from "@nestjs/common";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Contrato, Param ]),
        ParamModule,
        PontoModule
    ],
    controllers: [ ContratoController ],
    providers: [
        {
            provide: Providers.ContratoAdapter,
            useClass: ContratoAdapter
        },
        {
            provide: Providers.ContratoService,
            useClass: ContratoService
        },
        {
            provide: Providers.ContratoQueryGenerator,
            useClass: ContratoQueryGenerator
        }
    ]
})
export class ContratoModule {

}