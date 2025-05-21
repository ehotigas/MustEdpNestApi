import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreatePontoDto } from "./dto/create-ponto.dto";
import { UpdatePontoDto } from "./dto/update-ponto.dto";
import { GetPontoDto } from "./dto/get-ponto.dto";
import { IPontoAdapter } from "./ponto.adapter";
import { Providers } from "src/providers";
import { Region } from "src/types/region";
import { Ponto } from "./ponto.entity";


export interface IPontoService {
    findAll(id: string | undefined, nome: string | undefined, empresa: Region | undefined): Promise<GetPontoDto>;
    findById(id: string): Promise<Ponto>;
    findByName(name: string): Promise<Ponto>;
    save(input: CreatePontoDto): Promise<Ponto>;
    update(id: string, input: UpdatePontoDto): Promise<Ponto>;
    remove(id: string): Promise<Ponto>;
}

@Injectable()
export class PontoService implements IPontoService {
    private readonly logger = new Logger(PontoService.name);
    public constructor(
        @Inject(Providers.PontoAdapter)
        private readonly adapter: IPontoAdapter
    ) {  }

    public async findAll(
        id: string | undefined,
        nome: string | undefined,
        empresa: Region | undefined
    ): Promise<GetPontoDto> {
        this.logger.log(`Fetching all pontos with id: ${id}, nome: ${nome}, empresa: ${empresa}`);
        return {
            pontos: await this.adapter.findAll({
                id: id,
                nome: nome,
                empresa: empresa,
                createdAt: undefined
            })
        };
    }

    public async findById(id: string): Promise<Ponto> {
        this.logger.log(`Fetching ponto with id: ${id}`);
        const ponto = await this.adapter.findById(id);
        if (!ponto) {
            this.logger.warn(`Fail to fetch ponto with id: ${id}. Not found`);
            throw new InternalServerErrorException(`Fail to fetch ponto with id: ${id}. Not found`);
        }
        return ponto;
    }

    public async findByName(name: string): Promise<Ponto> {
        this.logger.log(`Fetching ponto with name: ${name}`);
        const ponto = await this.adapter.findByName(name);
        if (!ponto) {
            this.logger.warn(`Fail to fetch ponto with name: ${name}. Not found`);
            throw new InternalServerErrorException(`Fail to fetch ponto with name: ${name}. Not found`);
        }
        return ponto;
    }

    public async save(input: CreatePontoDto): Promise<Ponto> {
        this.logger.log(`Saving new ponto`);
        return await this.adapter.save({
            ...input,
            createdAt: new Date()
        });
    }

    public async update(id: string, input: UpdatePontoDto): Promise<Ponto> {
        this.logger.log(`Updating ponto with id: ${id}`);
        const ponto = await this.adapter.update(id, input);
        if (!ponto) {
            this.logger.warn(`Fail to update ponto with id: ${id}. Not found`);
            throw new InternalServerErrorException(`Fail to update ponto with id: ${id}. Not found`);
        }
        return ponto;
    }

    public async remove(id: string): Promise<Ponto> {
        this.logger.log(`Removing ponto with id: ${id}`);
        const ponto = await this.adapter.remove(id);
        if (!ponto) {
            this.logger.warn(`Fail to remove ponto with id: ${id}. Not found`);
            throw new InternalServerErrorException(`Fail to remove ponto with id: ${id}. Not found`);
        }
        return ponto;
    }
}