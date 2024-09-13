import { CustosController } from "./CustosController";
import { SimuladorModule } from "../SimuladorModule";
import { CustosAdapter } from "./CustosAdapter";
import { CustosService } from "./CustosService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Simulador } from "../Simulador";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Simulador
        ]),
        SimuladorModule
    ],
    controllers: [ CustosController ],
    providers: [
        {
            provide: Providers.CUSTOS_ADAPTER,
            useClass: CustosAdapter
        },
        {
            provide: Providers.CUSTOS_SERVICE,
            useClass: CustosService
        }
    ]
})
export class CustosModule {

}