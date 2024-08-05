import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from 'mongoose';
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

export type TarifaDocument = HydratedDocument<Tarifa>;

@Schema()
export class Tarifa {
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
    Tarifa: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Prop()
    Empresa: Region;
}

export const TarifaSchema = SchemaFactory.createForClass(Tarifa);