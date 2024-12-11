import { ContratoController } from "./contrato.controller";
import { ContratoAdapter } from "./contrato.adapter";
import { ContratoService } from "./contrato.service";
import { ParamModule } from "../param/param.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, Param } from "@nestjs/common";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Contrato, Param ]),
        ParamModule
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
        }
    ]
})
export class ContratoModule {

}