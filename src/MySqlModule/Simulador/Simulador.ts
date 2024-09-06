import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Mercado.Simulador")
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
    @Column({ type: Number })
    Demanda: number;

    @ApiProperty({ type: String })
    @Column({ type: String })
    TipoContrato: string;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Contrato: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Tarifa: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Confiabilidade: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Piu: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Add: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Pis: number;

    @ApiProperty({ type: Number })
    @Column({ type: Number })
    Eust: number;
}