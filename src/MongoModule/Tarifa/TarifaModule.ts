import { TarifaController } from "./TarifaController";
import { MongooseModule } from "@nestjs/mongoose";
import { Tarifa, TarifaSchema } from "./Tarifa";
import { TarifaAdapter } from "./TarifaAdapter";
import { TarifaService } from "./TarifaService";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Tarifa.name, schema: TarifaSchema }
        ])
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