import { LoggerModule } from "src/LoggerModule/LoggerModule";
import { SummaryController } from "./SummaryController";
import { SimuladorModule } from "../SimuladorModule";
import { SummaryAdapter } from "./SummaryAdapter";
import { SummaryService } from "./SummaryService";
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
    controllers: [ SummaryController ],
    providers: [
        {
            provide: Providers.SUMMARY_ADAPTER,
            useClass: SummaryAdapter
        },
        {
            provide: Providers.SUMMARY_SERVICE,
            useClass: SummaryService
        }
    ]
})
export class SummaryModule {

}