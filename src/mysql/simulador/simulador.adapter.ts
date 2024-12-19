import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ISimuladorQueryBuilder } from "./simulador-query-builder";
import { InjectRepository } from "@nestjs/typeorm";
import { Simulador } from "./simulador.entity";
import { Param } from "../param/param.entity";
import { Providers } from "src/Providers";
import { Repository } from "typeorm";


export interface ISimuladorAdapter {
    findData(year: number): Promise<Simulador[]>;
}


@Injectable()
export class SimuladorAdapter implements ISimuladorAdapter {
    private readonly logger = new Logger(SimuladorAdapter.name);
    public constructor(
        @InjectRepository(Param)
        private readonly repository: Repository<Param>,
        @Inject(Providers.SimuladorQueryBuilder)
        private readonly builder: ISimuladorQueryBuilder
    ) {  }

    public async findData(year: number): Promise<Simulador[]> {
        try {
            await this.repository.query(this.builder.dropBaseCustos());
            await this.repository.query(this.builder.createBaseCustos(year));
            await this.repository.query(this.builder.dropTablePis());
            await this.repository.query(this.builder.createTablePis());
            const data = await this.repository.query(this.builder.getSimuladorData());
            await this.repository.query(this.builder.dropBaseCustos());
            await this.repository.query(this.builder.dropTablePis());
            return data;
        }
        catch(error) {
            this.logger.error(`Fail to fetch simulador data for year: ${year}.`, error.stack);
            throw new InternalServerErrorException(`Fail to fetch simulador data for year: ${year}.`, error.message);
        }
    }
}