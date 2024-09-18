import { DemandaChartModule } from "./Simulador/DemandaChart/DemandaChartModule";
import { ConfiabilidadeModule } from "./Confiabilidade/ConfiabilidadeModule";
import { ParcelaABModule } from "./Simulador/ParcelaAB/ParcelaABModule";
import { SummaryModule } from "./Simulador/Summary/SummaryModule";
import { Confiabilidade } from "./Confiabilidade/Confiabilidade";
import { CustosModule } from "./Simulador/Custos/CustosModule";
import { SimuladorModule } from "./Simulador/SimuladorModule";
import { CicloModule } from "./Simulador/Ciclo/CicloModule";
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
        CicloModule,
        ConfiabilidadeModule,
        ContratoModule,
        CustosModule,
        DemandaModule,
        DemandaChartModule,
        ParcelaABModule,
        SimuladorModule,
        SummaryModule,
        TarifaModule
    ]
})
export class MySqlModule {

}