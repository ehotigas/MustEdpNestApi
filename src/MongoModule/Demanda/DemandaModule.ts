import { DemandaController } from "./DemandaController";
import { MongooseModule } from "@nestjs/mongoose";
import { Demanda, DemandaSchema } from "./Demanda";
import { DemandaAdapter } from "./DemandaAdapter";
import { DemandaService } from "./DemandaService";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Demanda.name, schema: DemandaSchema }
        ])
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