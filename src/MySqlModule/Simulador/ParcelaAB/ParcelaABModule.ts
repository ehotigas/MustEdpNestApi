import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { ParcelaABController } from "./ParcelaABController";
import { ParcelaABAdapter } from "./ParcelaABAdapter";
import { ParcelaABService } from "./ParcelaABService";
import { SimuladorModule } from "../SimuladorModule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";
import { Simulador } from "../Simulador";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Simulador
        ]),
        LoggerModule,
        SimuladorModule
    ],
    controllers: [ ParcelaABController ],
    providers: [
        {
            provide: Providers.PARCELAAB_ADAPTER,
            useClass: ParcelaABAdapter
        },
        {
            provide: Providers.PARCELAAB_SERVICE,
            useClass: ParcelaABService
        }
    ]
})
export class ParcelaABModule {

}