import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Simulador } from "./Simulador/Simulador";
import { SimuladorModule } from "./Simulador/SimuladorModule";

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'mssql',
        host: 'edpbredb.database.windows.net',
        port: 1433,
        username: 'usrDerp',
        password: 'X:Ztt,WQ?aQ5zyHJ',
        database: 'derp',
        // entities: [ LimiteTensao ],
        entities: [
          Simulador
        ],
        options: {
          encrypt: true,
          trustServerCertificate: true
        },
        // synchronize: true
      }),
      SimuladorModule
    ],
    controllers: [],
    providers: [],
  })
export class DdrcModule {
    
}