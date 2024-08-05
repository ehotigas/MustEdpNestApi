import { ApiProperty } from "@nestjs/swagger";

export class RunJobRequestDto {
    @ApiProperty({ type: Number })
    job_id: number
    // "jar_params": [
    //     "john",
    //     "doe",
    //     "35"
    // ],
    // "notebook_params": {
    //     "age": "35",
    //     "name": "john doe"
    // },
    // "python_params": [
    //     "john doe",
    //     "35"
    // ],
    // "spark_submit_params": [
    //     "--class",
    //     "org.apache.spark.examples.SparkPi"
    // ],
    // "python_named_params": {
    //     "data": "dbfs:/path/to/data.json",
    //     "name": "task"
    // },
    // "sql_params": {
    //     "age": "35",
    //     "name": "john doe"
    // },
    // "dbt_commands": [
    //     "dbt deps",
    //     "dbt seed",
    //     "dbt run"
    // ],
    // "pipeline_params": {
    //     "full_refresh": false
    // },
    // "idempotency_token": "8f018174-4792-40d5-bcbc-3e6a527352c8",
    // "queue": {
    //     "enabled": true
    // },
    // "job_parameters": {
    //     "property1": "string",
    //     "property2": "string"
    // }
}