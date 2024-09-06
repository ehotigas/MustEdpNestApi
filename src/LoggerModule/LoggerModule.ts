import { LoggerFactory } from "./LoggerFactory";
import { Providers } from "src/Providers";
import { Module } from "@nestjs/common";

@Module({
    providers: [
        {
            provide: Providers.LOGGER_FACTORY,
            useClass: LoggerFactory
        }
    ],
    exports: [
        Providers.LOGGER_FACTORY
    ]
})
export class LoggerModule {

}