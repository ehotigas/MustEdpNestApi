import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Param } from "../param/param.entity";
import { Region } from "src/types/region";


@Entity("ponto")
export class Ponto {
    @PrimaryColumn({ type: "varchar", length: 3 })
    @ApiProperty({ type: String })
    id: string;

    @Column({ type: String })
    @ApiProperty({ type: String })
    nome: string;

    @Column({ type: String })
    @ApiProperty({ type: String, enum: Region })
    empresa: Region;

    @Column({ type: Date })
    @ApiProperty({ type: Date })
    createdAt: Date;

    @OneToMany(() => Param, param => param.ponto)
    // @ApiProperty({ type: () => [Param] })
    paramList?: Param[];
}