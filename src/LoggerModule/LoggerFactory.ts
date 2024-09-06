import { Injectable, Logger } from "@nestjs/common";

export interface ILoggerFactory {
    /**
     * @param {string} context 
     * @returns {Logger}
     */
    getInstance(context: string): Logger;
}

@Injectable()
export class LoggerFactory implements ILoggerFactory {
    public getInstance(context: string): Logger {
        return new Logger(context);
    }
}