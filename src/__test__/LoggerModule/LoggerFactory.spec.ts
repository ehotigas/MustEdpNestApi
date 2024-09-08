import { ILoggerFactory, LoggerFactory } from "src/LoggerModule/LoggerFactory";
import { Providers } from "src/Providers";
import { Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";

describe('LoggerFactory', () => {
    let factory: ILoggerFactory;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: Providers.LOGGER_FACTORY,
                    useClass: LoggerFactory
                }
            ]
        }).compile();
        factory = app.get<ILoggerFactory>(Providers.LOGGER_FACTORY);
    });

    it('should be defined', () => {
        expect(factory).toBeDefined();
    });

    describe('getInstance', () => {
        it('should return a logger successfuly', async () => {
            const result = await factory.getInstance("Test");
            expect(result).toBeInstanceOf(Logger);
        });
    });
});