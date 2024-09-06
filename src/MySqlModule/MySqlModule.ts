import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfiabilidadeModule } from "./Confiabilidade/ConfiabilidadeModule";
import { Confiabilidade } from "./Confiabilidade/Confiabilidade";

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
                Confiabilidade
            ],
            // synchronize: true,
        }),
        ConfiabilidadeModule
    ]
})
export class MySqlModule {

}