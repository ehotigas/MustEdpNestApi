import { PenalidadeModule } from "./penalidade/penalidade.module";
import { SimuladorModule } from "./simulador/simulador.module";
import { ContratoModule } from "./contrato/contrato.module";
import { ParamModule } from "./param/param.module";
import { PontoModule } from "./ponto/ponto.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '10.161.248.71',
            port: 3307,
            username: 'eh_o_tigas',
            password: '#Edp.202412',
            database: 'edp',
            entities: [__dirname + '/../**/*.entity.{ts,js}'],
            migrations: [__dirname + '/../migrations/*.{ts}'],
            autoLoadEntities: true,
            synchronize: false,
        }),
        ContratoModule,
        ParamModule,
        PenalidadeModule,
        PontoModule,
        SimuladorModule
    ]
})
export class MySqlModule {

}