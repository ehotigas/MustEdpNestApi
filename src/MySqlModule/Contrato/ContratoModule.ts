import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { ContratoController } from "./ContratoController";
import { ContratoAdapter } from "./ContratoAdapter";
import { ContratoService } from "./ContratoService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";
import { Contrato } from "./Contrato";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Contrato ]),
        LoggerModule
    ],
    controllers: [ ContratoController ],
    providers: [
        {
            provide: Providers.CONTRATO_ADAPTER,
            useClass: ContratoAdapter
        },
        {
            provide: Providers.CONTRATO_SERVICE,
            useClass: ContratoService
        }
    ]
})
export class ContratoModule {

}