import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    
    @Column({ type: Date })
    @ApiProperty({ type: Date })
    data: Date;

    @Column({ name: "tipo_dado", type: String })
    @ApiProperty({ type: String, enum: DataType })
    tipoDado: DataType;

    @Column({ type: String })
    @ApiProperty({ type: String })
    cenario: string;

    @Column({ type: "decimal" })
    @ApiProperty({ type: Number })
    valor: number;


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