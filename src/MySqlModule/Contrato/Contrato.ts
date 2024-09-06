import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";
import { Posto } from "src/types/Posto";

@Entity("Mercado.Contrato")
export class Contrato {
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
    TipoContrato: string;
    
    @ApiProperty({ type: Number })
    @Column({ type: Number, nullable: true })
    Contrato: number;
    
    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({ type: String, nullable: true })
    Empresa: Region;

    public constructor(contrato?: Partial<Contrato>) {
        this.Id = contrato?.Id;
        this.Ponto = contrato?.Ponto;
        this.Posto = contrato?.Posto;
        this.Data = contrato?.Data;
        this.TipoContrato = contrato?.TipoContrato;
        this.Contrato = contrato?.Contrato;
        this.Empresa = contrato?.Empresa;
    }
}