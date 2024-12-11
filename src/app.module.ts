import { ParamModule } from './mysql/param/param.module';
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
    ParamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
