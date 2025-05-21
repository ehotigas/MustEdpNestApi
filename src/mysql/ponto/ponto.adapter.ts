import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ponto } from "./ponto.entity";
import { Repository } from "typeorm";


export interface IPontoAdapter {
    findAll(filters: Ponto): Promise<Ponto[]>;
    findById(id: string): Promise<Ponto>;
    findByName(name: string): Promise<Ponto>;
    save(input: Ponto): Promise<Ponto>;
    update(id: string, input: Partial<Ponto>): Promise<Ponto>;
    remove(id: string): Promise<Ponto>;
}


@Injectable()
export class PontoAdapter implements IPontoAdapter {
    private readonly logger = new Logger(PontoAdapter.name);
    public constructor(
        @InjectRepository(Ponto)
        private readonly repository: Repository<Ponto>
    ) {  }

    public async findAll(filters: Ponto): Promise<Ponto[]> {
        try {
            return await this.repository.find({
                where: filters
            });
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

    public async findById(id: string): Promise<Ponto> {
        try {
            return await this.repository.findOne({
                where: { id }
            });
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

    public async findByName(name: string): Promise<Ponto> {
        try {
            return await this.repository.findOne({
                where: { nome: name }
            });
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

    public async save(input: Ponto): Promise<Ponto> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

    public async update(id: string, input: Partial<Ponto>): Promise<Ponto> {
        try {
            const ponto = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save(ponto);
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

    public async remove(id: string): Promise<Ponto> {
        try {
            const ponto = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(ponto);
        }
        catch (error) {
            this.logger.error(`Fail to find all ponto`, error.stack);
            throw new InternalServerErrorException(`Fail to find all ponto`, error.message);
        }
    }

}