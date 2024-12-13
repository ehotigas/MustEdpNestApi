import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Param } from "../param/param.entity";


@Entity("contrato")
export class Contrato {
    @PrimaryGeneratedColumn()
    @ApiProperty({ type: Number })
    id: number;

    @OneToOne(() => Param, param => param.contrato, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    @ApiProperty({ type: () => Param })
    demanda: Param;
    
    @Column({ type: "decimal", precision: 15, scale: 3 })
    @ApiProperty({ type: Number })
    valor: number;
}