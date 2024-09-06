import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

@Entity("Confiabilidade")
export class Confiabilidade {
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
    Confiabilidade: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({ type: String, nullable: true })
    Empresa: Region;

    public constructor(confiabilidade?: Partial<Confiabilidade>) {
        this.Id = confiabilidade?.Id;
        this.Ponto = confiabilidade?.Ponto;
        this.Posto = confiabilidade?.Posto;
        this.Data = confiabilidade?.Data;
        this.Confiabilidade = confiabilidade?.Confiabilidade;
        this.Empresa = confiabilidade?.Empresa;
    }
}