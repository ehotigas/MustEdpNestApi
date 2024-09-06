import { DemandaController } from "./DemandaController";
import { DemandaAdapter } from "./DemandaAdapter";
import { DemandaService } from "./DemandaService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";
import { Demanda } from "./Demanda";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Demanda ])
    ],
    controllers: [ DemandaController ],
    providers: [
        {
            provide: Providers.DEMANDA_ADAPTER,
            useClass: DemandaAdapter
        },
        {
            provide: Providers.DEMANDA_SERVICE,
            useClass: DemandaService
        }
    ]
})
export class DemandaModule {

}