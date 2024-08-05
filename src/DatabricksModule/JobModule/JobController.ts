import { Body, Controller, Inject, Post, ValidationPipe } from "@nestjs/common";
import { DatabricksProviders } from "../DatabricksProviders";
import { RunJobResponseDto } from "./dto/RunJobResponseDto";
import { RunJobRequestDto } from "./dto/RunJobRequestDto";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { RequestError } from "src/types/RequestError";
import { JobServiceInterface } from "./JobService";


@Controller()
export class JobController {
    public constructor(
        @Inject(DatabricksProviders.JOB_SERVICE)
        private readonly service: JobServiceInterface
    ) {  }


    @Post("/run")
    @ApiBody({ type: RunJobRequestDto })
    @ApiResponse({
        status: 201,
        type: RunJobResponseDto
    })
    @ApiResponse({
        status: 500,
        type: RequestError
    })
    public async run(
        @Body(new ValidationPipe()) input: RunJobRequestDto
    ): Promise<RunJobResponseDto | RequestError> {
        return await this.service.run(input);
    }
}