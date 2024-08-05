import { ApiProperty } from "@nestjs/swagger";

export class RunJobResponseDto {
    @ApiProperty({ type: Number })
    run_id: number;
    
    @ApiProperty({ type: Number })
    number_in_job: number;
}