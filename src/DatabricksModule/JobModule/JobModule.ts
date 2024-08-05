import { DatabricksProviders } from "../DatabricksProviders";
import { DatabricksAdapter } from "../DatabricksAdapter";
import { JobController } from "./JobController";
import { JobService } from "./JobService";
import { Module } from "@nestjs/common";

@Module({
    controllers: [ JobController ],
    providers: [
        {
            provide: DatabricksProviders.DATABRICKS_ADAPTER,
            useClass: DatabricksAdapter
        },
        {
            provide: DatabricksProviders.JOB_SERVICE,
            useClass: JobService
        }
    ]
})
export class JobModule {

}