import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contrato } from "../contrato/contrato.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Ponto } from "../ponto/ponto.entity";



@Entity("param")
export class Param {
    @PrimaryGeneratedColumn()
    @ApiProperty({ type: Number })
    id: number;
    
    @ManyToOne(() => Ponto, ponto => ponto.paramList, { onDelete: "SET NULL" })
    @ApiProperty({ type: () => Ponto })
    ponto: Ponto;
    
    @Column({ type: Date })
    @ApiProperty({ type: Date })
    data: Date;

    @Column({ type: String, nullable: true })
    @ApiProperty({ type: String })
    cenario: string;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    tarifaPonta: number;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    tarifaForaPonta: number;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    demandaPonta: number;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    demandaForaPonta: number;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    confiabilidadePonta: number;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    confiabilidadeForaPonta: number;

    @OneToOne(() => Contrato, contrato => contrato.demanda)
    @ApiProperty({ type: () => Contrato })
    contrato?: Contrato;

    public constructor(param?: Partial<Param>) {
        this.id = param?.id;
        this.ponto = param?.ponto;
        this.data = param?.data;
        this.cenario = param?.cenario;
        this.tarifaPonta = param?.tarifaPonta;
        this.tarifaForaPonta = param?.tarifaForaPonta;
        this.demandaPonta = param?.demandaPonta;
        this.demandaForaPonta = param?.demandaForaPonta;
        this.confiabilidadePonta = param?.confiabilidadePonta;
        this.confiabilidadeForaPonta = param?.confiabilidadeForaPonta;
    }
}