import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Posto } from "src/types/posto";
import { DataType } from "../data-type";

export class GetParamRequestDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ type: Number })
    id?: number;
    
    @IsOptional()
    @IsEnum(Posto)
    @ApiPropertyOptional({ type: String, enum: Posto })
    posto?: Posto;
    
    @IsOptional()
    @IsDate()
    @ApiPropertyOptional({ type: Date })
    data?: Date;
    
    @IsOptional()
    @IsEnum(DataType)
    @ApiPropertyOptional({ type: String, enum: DataType })
    tipoDado?: DataType;
    
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String })
    cenario?: string;
    
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ type: Number })
    valor?: number;
}