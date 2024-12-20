import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IPenalidadeQueryBuilder } from "./penalidade-query-builder";
import { InjectRepository } from "@nestjs/typeorm";
import { Penalidade } from "./penalidade.entity";
import { Param } from "../param/param.entity";
import { Providers } from "src/Providers";
import { Repository } from "typeorm";


export interface IPenalidadeAdapter {
    findPenalidadeTable(): Promise<Penalidade[]>; 
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

    public async findPenalidadeTable(): Promise<Penalidade[]> {
        try {
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.createCustosTable());
            await this.repository.query(this.builder.dropPisTable());
            await this.repository.query(this.builder.createPisTable());
            const data = await this.repository.query(this.builder.getPenalityData());
            await this.repository.query(this.builder.dropCustosTable());
            await this.repository.query(this.builder.dropPisTable());
            return data;
        }
        catch(error) {
            this.logger.error(`Fail to fetch penalidade table`, error.stack);
            throw new InternalServerErrorException(`Fail to fetch penalidade table`, error.message);
        }
    }
}