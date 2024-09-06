import { DatabricksModule } from './DatabricksModule/DatabricksModule';
import { MongoModule } from './MongoModule/MongoModule';
import { MySqlModule } from './MySqlModule/MySqlModule';
import { DdrcModule } from './DdrcModule/DdrcModule';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // DatabricksModule,
    // DdrcModule,
    // MongoModule
    MySqlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
