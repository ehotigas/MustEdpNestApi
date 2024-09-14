import { DemandaChartController } from "./DemandaChartController";
import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { DemandaChartAdapter } from "./DemandaChartAdapter";
import { DemandaChartService } from "./DemandaChartService";
import { SimuladorModule } from "../SimuladorModule";
import { TypeOrmModule } from "@nestjs/typeorm";
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
    controllers: [ DemandaChartController ],
    providers: [
        {
            provide: Providers.DEMANDA_CHART_ADAPTER,
            useClass: DemandaChartAdapter
        },
        {
            provide: Providers.DEMANDA_CHART_SERVICE,
            useClass: DemandaChartService
        }
    ]
})
export class DemandaChartModule {

}