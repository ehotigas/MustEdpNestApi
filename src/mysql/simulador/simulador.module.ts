import { SimuladorQueryBuilder } from "./simulador-query-builder";
import { SimuladorController } from "./simulador.controller";
import { SimuladorAdapter } from "./simulador.adapter";
import { SimuladorService } from "./simulador.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, Param } from "@nestjs/common";
import { Providers } from "src/Providers";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Param ])
    ],
    controllers: [ SimuladorController ],
    providers: [
        {
            provide: Providers.SimuladorAdapter,
            useClass: SimuladorAdapter
        },
        {
            provide: Providers.SimuladorService,
            useClass: SimuladorService
        },
        {
            provide: Providers.SimuladorQueryBuilder,
            useClass: SimuladorQueryBuilder
        }
    ]
})
export class SimuladorModule {

}