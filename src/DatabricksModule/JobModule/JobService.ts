import { DatabricksAdapterInterface } from "../DatabricksAdapter";
import { DatabricksProviders } from "../DatabricksProviders";
import { RunJobResponseDto } from "./dto/RunJobResponseDto";
import { RunJobRequestDto } from "./dto/RunJobRequestDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";

export interface JobServiceInterface {
    run: (input: RunJobRequestDto) => Promise<RunJobResponseDto | RequestError>
}

@Injectable()
export class JobService implements JobServiceInterface {
    public constructor(
        @Inject(DatabricksProviders.DATABRICKS_ADAPTER)
        private readonly adapter: DatabricksAdapterInterface
    ) {  }
    
    public async run(input: RunJobRequestDto): Promise<RunJobResponseDto | RequestError> {
        try {
            const req = await this.adapter.fetch(
                "/api/2.1/jobs/run-now",
                {
                    method: 'POST',
                    data: JSON.stringify(input)
                }
            );
            if (!req.status.toString().startsWith('2')) {
                return new RequestError(req.statusText, req.status);
            }
            return await req.data as RunJobResponseDto;
        } catch(error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}