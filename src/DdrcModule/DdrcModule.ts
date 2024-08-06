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
        type: 'mssql',
        host: 'edpbredb.database.windows.net',
        port: 1433,
        username: 'usrDerp',
        password: 'X:Ztt,WQ?aQ5zyHJ',
        database: 'derp',
        // entities: [  ],
        entities: [
          Confiabilidade, Contrato, Demanda, Simulador, Tarifa
        ],
        options: {
          encrypt: true,
          trustServerCertificate: true
        },
        // synchronize: true
      }),
      ConfiabilidadeModule,
      ContratoModule,
      DemandaModule,
      SimuladorModule,
      TarifaModule
    ],
    controllers: [],
    providers: [],
  })
export class DdrcModule {
    
}