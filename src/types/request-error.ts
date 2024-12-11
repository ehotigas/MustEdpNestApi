import { ApiProperty } from "@nestjs/swagger";

export class RequestError {
    @ApiProperty({ type: String })
    private readonly message: string;
    @ApiProperty({ type: Number })
    private readonly statusCode: number;

    public constructor(
        message: string,
        statusCode: number = 500
    ) {
        this.message = message;
        this.statusCode = statusCode;
    }
}