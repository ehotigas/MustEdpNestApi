import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from 'mongoose';
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export type ContratoDocument = HydratedDocument<Contrato>;

@Schema()
export class Contrato {
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

    @ApiProperty({ type: String })
    @Prop()
    TipoContrato: string;
    
    @ApiProperty({ type: Number })
    @Prop()
    Contrato: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Prop()
    Empresa: Region;
}

export const ContratoSchema = SchemaFactory.createForClass(Contrato);