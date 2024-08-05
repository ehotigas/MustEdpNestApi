import { Confiabilidade, ConfiabilidadeSchema } from "./Confiabilidade";
import { ConfiabilidadeController } from "./ConfiabilidadeController";
import { ConfiabilidadeAdapter } from "./ConfiabilidadeAdapter";
import { ConfiabilidadeService } from "./ConfiabilidadeService";
import { MongooseModule } from "@nestjs/mongoose";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Confiabilidade.name, schema: ConfiabilidadeSchema }
        ])
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