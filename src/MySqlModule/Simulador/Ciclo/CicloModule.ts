import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { SimuladorModule } from "../SimuladorModule";
import { CicloController } from "./CicloController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CicloAdapter } from "./CicloAdapter";
import { CicloService } from "./CicloService";
import { Providers } from "src/Providers";
import { Simulador } from "../Simulador";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Simulador
        ]),
        LoggerModule,
        SimuladorModule
    ],
    controllers: [ CicloController ],
    providers: [
        {
            provide: Providers.CICLO_ADAPTER,
            useClass: CicloAdapter
        },
        {
            provide: Providers.CICLO_SERVICE,
            useClass: CicloService
        }
    ]
})
export class CicloModule {

}