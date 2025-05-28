import { SharepointModule } from './sharepoint/sharepoint.module';
import { MySqlModule } from './mysql/mysql.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';


@Module({
  imports: [
    // DatabricksModule,
    // DdrcModule,
    // MongoModule
    MySqlModule,
    SharepointModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
