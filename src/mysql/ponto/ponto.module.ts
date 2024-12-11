import { PontoController } from "./ponto.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PontoAdapter } from "./ponto.adapter";
import { PontoService } from "./ponto.service";
import { Providers } from "src/providers";
import { Module } from "@nestjs/common";
import { Ponto } from "./ponto.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Ponto ])
    ],
    controllers: [ PontoController ],
    providers: [
        {
            provide: Providers.PontoAdapter,
            useClass: PontoAdapter
        },
        {
            provide: Providers.PontoService,
            useClass: PontoService
        }
    ],
    exports: [ Providers.PontoService ]
})
export class PontoModule {

}