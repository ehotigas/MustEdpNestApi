import { JobModule } from "./JobModule/JobModule";
import { Module } from "@nestjs/common";

@Module({
    imports: [ JobModule ]
})
export class DatabricksModule {

}