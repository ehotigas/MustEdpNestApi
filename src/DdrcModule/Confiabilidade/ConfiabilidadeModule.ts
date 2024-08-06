import { ConfiabilidadeController } from "./ConfiabilidadeController";
import { ConfiabilidadeAdapter } from "./ConfiabilidadeAdapter";
import { ConfiabilidadeService } from "./ConfiabilidadeService";
import { Confiabilidade } from "./Confiabilidade";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Confiabilidade ])
    ],
    controllers: [ ConfiabilidadeController ],
    providers: [
        {
            provide: Providers.CONFIABILIDADE_ADAPTER,
            useClass: ConfiabilidadeAdapter
        },
        {
            provide: Providers.CONFIABILIDADE_SERVICE,
            useClass: ConfiabilidadeService
        }
    ]
})
export class ConfiabilidadeModule {

}