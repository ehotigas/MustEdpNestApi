import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from 'mongoose';
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export type ConfiabilidadeDocument = HydratedDocument<Confiabilidade>;

@Schema()
export class Confiabilidade {
    _id?: number;
    
    @ApiProperty({ type: Number })
    @Prop()
    Id: number;
    
    @ApiProperty({ type: String })
    @Prop()
    Ponto: string;
    
    @ApiProperty({
        type: String,
        enum: Posto
    })
    @Prop()
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    @Prop()
    Data: Date;
    
    @ApiProperty({ type: Number })
    @Prop()
    Confiabilidade: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Prop()
    Empresa: Region;
}

export const ConfiabilidadeSchema = SchemaFactory.createForClass(Confiabilidade);