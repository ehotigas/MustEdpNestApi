import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contrato } from "../contrato/contrato.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Ponto } from "../ponto/ponto.entity";
import { Posto } from "src/types/posto";
import { DataType } from "./data-type";


@Entity("param")
export class Param {
    @PrimaryGeneratedColumn()
    @ApiProperty({ type: Number })
    id: number;
    
    @ManyToOne(() => Ponto, ponto => ponto.paramList, { onDelete: "SET NULL" })
    @ApiProperty({ type: () => Ponto })
    ponto: Ponto;
    
    @Column({ type: String })
    @ApiProperty({ type: String, enum: Posto })
    posto: Posto;
    
    @Column({ type: "date" })
    @ApiProperty({ type: Date })
    data: Date | string;

    @Column({ name: "tipo_dado", type: String })
    @ApiProperty({ type: String, enum: DataType })
    tipoDado: DataType;

    @Column({ type: String, nullable: true })
    @ApiProperty({ type: String })
    cenario: string;

    @Column({ type: "decimal", precision: 15, scale: 3, nullable: true })
    @ApiProperty({ type: Number })
    valor: number;

    @OneToOne(() => Contrato, contrato => contrato.demanda)
    @ApiProperty({ type: () => Contrato })
    contrato?: Contrato;

    public constructor(param?: Partial<Param>) {
        this.id = param?.id;
        this.ponto = param?.ponto;
        this.posto = param?.posto;
        this.data = param?.data;
        this.tipoDado = param?.tipoDado;
        this.cenario = param?.cenario;
        this.valor = param?.valor;
    }
}