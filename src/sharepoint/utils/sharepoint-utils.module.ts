import { CsvParser } from "./csv-parser";
import { Providers } from "src/Providers";
import { DateUtils } from "./date-utils";
import { Module } from "@nestjs/common";


@Module({
    providers: [
        { provide: Providers.CsvParser, useClass: CsvParser },
        { provide: Providers.DateUtils, useClass: DateUtils },
    ],
    exports: [ Providers.CsvParser, Providers.DateUtils ]
})
export class SharepointUtilsModule {

}