import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { TipoTarifa } from "./TipoTarifa";
import { Posto } from "src/types/Posto";

@Entity("Tarifa")
export class Tarifa {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn()
    Id: number;
    
    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    Ponto: string;
    
    @ApiProperty({ type: String, enum: Posto })
    @Column({ type: String, nullable: true })
    Posto: Posto;
    
    @ApiProperty({ type: Date })
    @Column({ type: Date, nullable: true })
    Data: Date;
    
    @ApiProperty({ type: String, enum: TipoTarifa })
    @Column({ type: String, nullable: true })
    TipoTarifa: TipoTarifa;

    @ApiProperty({ type: Number })
    @Column({ type: 'double', nullable: true })
    Tarifa: number; 
    
    @ApiProperty({ type: String, enum: Region })
    @Column({ type: String, nullable: true })
    Empresa: Region;
}