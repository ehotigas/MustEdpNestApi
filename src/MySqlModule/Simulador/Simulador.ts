import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/types/Region";

@Entity("Simulador")
export class Simulador {
    @ApiProperty({ type: Number })
    @PrimaryGeneratedColumn()
    Id: number;

    @ApiProperty({ type: Date })
    @Column({ type: Date })
    Data: Date;

    @ApiProperty({ type: String })
    @Column({ type: String })
    Ponto: string;

    @ApiProperty({ type: String })
    @Column({ type: String })
    Posto: string;

    @ApiProperty({ type: String })
    @Column({ type: String })
    TipoDemanda: string;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Demanda: number;

    @ApiProperty({ type: String })
    @Column({ type: String })
    TipoContrato: string;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Contrato: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float', nullable: true })
    TarifaDra: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float', nullable: true })
    TarifaDrp: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Confiabilidade: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Piu: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Add: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Pis: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float' })
    Eust: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float', nullable: true })
    Dra: number;

    @ApiProperty({ type: Number })
    @Column({ type: 'float', nullable: true })
    Drp: number;

    @ApiProperty({
        type: String,
        enum: Region
    })
    @Column({ type: String, nullable: true })
    Empresa: Region;
}