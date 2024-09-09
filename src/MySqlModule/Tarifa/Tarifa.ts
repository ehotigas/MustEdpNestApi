import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

@Entity("Tarifa")
export class Tarifa {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn()
    Id: number;
    
    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    Ponto: string;
    
    @ApiProperty({
        type: String,
        enum: Posto
    })
    @Column({ type: String, nullable: true })
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    @Column({ type: Date, nullable: true })
    Data: Date;
    
    @ApiProperty({ type: Number })
    @Column({ type: Number, nullable: true })
    TarifaDra: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number, nullable: true })
    TarifaDrp: number; // Tarifa
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({ type: String, nullable: true })
    Empresa: Region;
}