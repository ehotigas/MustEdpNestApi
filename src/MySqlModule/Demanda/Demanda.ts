import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

@Entity("Demanda")
export class Demanda {
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

    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    TipoDemanda: string;
    
    @ApiProperty({ type: Number })
    @Column({ type: Number, nullable: true })
    Demanda: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({ type: String, nullable: true })
    Empresa: Region;

    public constructor(demanda?: Partial<Demanda>) {
        this.Id = demanda?.Id;
        this.Ponto = demanda?.Ponto;
        this.Posto = demanda?.Posto;
        this.Data = demanda?.Data;
        this.TipoDemanda = demanda?.TipoDemanda;
        this.Demanda = demanda?.Demanda;
        this.Empresa = demanda?.Empresa;
    }
}