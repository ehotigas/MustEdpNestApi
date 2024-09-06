import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { TarifaController } from "./TarifaController";
import { TarifaAdapter } from "./TarifaAdapter";
import { TarifaService } from "./TarifaService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";
import { Tarifa } from "./Tarifa";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Tarifa ]),
        LoggerModule
    ],
    controllers: [ TarifaController ],
    providers: [
        {
            provide: Providers.TARIFA_ADAPTER,
            useClass: TarifaAdapter
        },
        {
            provide: Providers.TARIFA_SERVICE,
            useClass: TarifaService
        }
    ]
})
export class TarifaModule {

}