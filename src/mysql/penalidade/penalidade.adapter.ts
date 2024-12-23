import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IPenalidadeQueryBuilder } from "./penalidade-query-builder";
import { InjectRepository } from "@nestjs/typeorm";
import { Penalidade } from "./penalidade.entity";
import { Param } from "../param/param.entity";
import { Providers } from "src/Providers";
import { Posto } from "src/types/posto";
import { Repository } from "typeorm";
import { Region } from "src/types/region";


export interface IPenalidadeAdapter {
    findPenalidadeTable(year: number, region: Region): Promise<Penalidade[]>; 
    findPenalidadeChat(year: number, ponto: string, posto: Posto, contrato: string, demanda: string, region: Region): Promise<Penalidade[]>;
}


@Injectable()
export class PenalidadeAdapter implements IPenalidadeAdapter {
    private readonly logger = new Logger(PenalidadeAdapter.name);
    public constructor(
        @InjectRepository(Param)
        private readonly repository: Repository<Param>,
        @Inject(Providers.PenalidadeQueryBuilder)
        private readonly builder: IPenalidadeQueryBuilder
    ) {  }

    public async findPenalidadeTable(year: number, region: Region): Promise<Penalidade[]> {
        try {
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.createCustosTable(year));
            await this.repository.query(this.builder.dropPisTable());
            await this.repository.query(this.builder.createPisTable());
            const data = await this.repository.query(this.builder.getPenalityData(region));
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.dropPisTable());
            return data;
        }
        catch(error) {
            this.logger.error(`Fail to fetch penalidade table`, error.stack);
            throw new InternalServerErrorException(`Fail to fetch penalidade table`, error.message);
        }
    }

    public async findPenalidadeChat(year: number, ponto: string, posto: Posto, contrato: string, demanda: string, region: Region): Promise<Penalidade[]> {
        try {
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.createCustosTable(year));
            await this.repository.query(this.builder.dropPisTable());
            await this.repository.query(this.builder.createPisTable());
            const data = await this.repository.query(this.builder.getPenalidadeChart(ponto, posto, contrato, demanda, region));
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.dropPisTable());
            return data;
        }
        catch(error) {
            this.logger.error(`Fail to fetch penalidade chart`, error.stack);
            throw new InternalServerErrorException(`Fail to fetch penalidade chart`, error.message);
        }
    }
}