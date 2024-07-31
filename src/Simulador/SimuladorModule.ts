import { SimuladorController } from "./SimuladorController";
import { SimuladorAdapter } from "./SimuladorAdapter";
import { SimuladorService } from "./SimuladorService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";
import { Simulador } from "./Simulador";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Simulador ])
    ],
    controllers: [ SimuladorController ],
    providers: [
        {
            provide: Providers.SIMULADOR_ADAPTER,
            useClass: SimuladorAdapter
        },
        {
            provide: Providers.SIMULADOR_SERVICE,
            useClass: SimuladorService
        },
    ]
})
export class SimuladorModule {

}