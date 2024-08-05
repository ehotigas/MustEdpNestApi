import { ContratoController } from "./ContratoController";
import { MongooseModule } from "@nestjs/mongoose";
import { Contrato, ContratoSchema } from "./Contrato";
import { ContratoAdapter } from "./ContratoAdapter";
import { ContratoService } from "./ContratoService";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Contrato.name, schema: ContratoSchema }
        ])
    ],
    controllers: [ ContratoController ],
    providers: [
        {
            provide: Providers.CONTRATO_ADAPTER,
            useClass: ContratoAdapter
        },
        {
            provide: Providers.CONTRATO_SERVICE,
            useClass: ContratoService
        }
    ]
})
export class ContratoModule {

}