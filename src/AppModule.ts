import { SimuladorModule } from './Simulador/SimuladorModule';
import { Simulador } from './Simulador/Simulador';
import { AppController } from './AppController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './AppService';
import { Module } from '@nestjs/common';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
