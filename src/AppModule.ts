import { DatabricksModule } from './DatabricksModule/DatabricksModule';
import { MongoModule } from './MongoModule/MongoModule';
import { DdrcModule } from './DdrcModule/DdrcModule';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabricksModule,
    DdrcModule,
    // MongoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
