import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

@Entity("Mercado.Tarifa")
export class Tarifa {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn()
    Id: number;
    
    @ApiProperty({ type: String })
    @Column({ type: String })
    Ponto: string;
    
    @ApiProperty({
        type: String,
        enum: Posto
    })
    @Column({
        type: String,
        enum: Posto
    })
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    @Column({ type: Date })
    Data: Date;
    
    @ApiProperty({ type: Number })
    @Column({ type: Number, nullable: true })
    Tarifa: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({
        type: String,
        enum: Region
    })
    Empresa: Region;
}