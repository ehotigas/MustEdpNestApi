import { MySqlModule } from './MySqlModule/MySqlModule';
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
