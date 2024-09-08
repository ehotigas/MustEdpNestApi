import { ConfiabilidadeModule } from "./Confiabilidade/ConfiabilidadeModule";
import { Confiabilidade } from "./Confiabilidade/Confiabilidade";
import { SimuladorModule } from "./Simulador/SimuladorModule";
import { ContratoModule } from "./Contrato/ContratoModule";
import { DemandaModule } from "./Demanda/DemandaModule";
import { TarifaModule } from "./Tarifa/TarifaModule";
import { Simulador } from "./Simulador/Simulador";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contrato } from "./Contrato/Contrato";
import { Demanda } from "./Demanda/Demanda";
import { Tarifa } from "./Tarifa/Tarifa";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'edp',
            entities: [
                Confiabilidade, Contrato, Demanda, Simulador, Tarifa
            ],
            // synchronize: true,
        }),
        ConfiabilidadeModule,
        ContratoModule,
        DemandaModule,
        SimuladorModule,
        TarifaModule
    ]
})
export class MySqlModule {

}