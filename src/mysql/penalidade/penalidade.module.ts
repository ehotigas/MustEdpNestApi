import { PenalidadeController } from "./penalidade.controller";
import { PenalidadeAdapter } from "./penalidade.adapter";
import { PenalidadeService } from "./penalidade.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, Param } from "@nestjs/common";
import { Providers } from "src/Providers";


@Module({
    imports: [
        TypeOrmModule.forFeature([ Param ])
    ],
    controllers: [ PenalidadeController ],
    providers: [
        {
            provide: Providers.PenalidadeAdapter,
            useClass: PenalidadeAdapter
        },
        {
            provide: Providers.PenalidadeService,
            useClass: PenalidadeService
        }
    ]
})
export class PenalidadeModule {

}