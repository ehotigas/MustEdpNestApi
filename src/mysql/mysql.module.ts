import { PontoModule } from "./ponto/ponto.module";
import { TypeOrmModule } from "@nestjs/typeorm";
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
            entities: [__dirname + '/../**/*.entity.ts'],
            migrations: [__dirname + '/../migrations/*.{ts}'],
            synchronize: false,
        }),
        PontoModule
    ]
})
export class MySqlModule {

}