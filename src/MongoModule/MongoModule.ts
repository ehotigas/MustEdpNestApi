import { ConfiabilidadeModule } from "./Confiabilidade/ConfiabilidadeModule";
import { ContratoModule } from "./Contrato/ContratoModule";
import { DemandaModule } from "./Demanda/DemandaModule";
import { TarifaModule } from "./Tarifa/TarifaModule";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/edp'),
        ConfiabilidadeModule,
        ContratoModule,
        DemandaModule,
        TarifaModule
    ],
    controllers: [],
    providers: []
})
export class MongoModule {

}