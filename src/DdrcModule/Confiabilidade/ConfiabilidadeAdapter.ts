import { RequestError } from "src/types/RequestError";
import { InjectRepository } from "@nestjs/typeorm";
import { Confiabilidade } from "./Confiabilidade";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Repository } from "typeorm";

export interface ConfiabilidadeAdapterInterface {
    findAll: (region: Region) => Promise<Confiabilidade[] | RequestError>
    find: (id: number) => Promise<Confiabilidade | RequestError>
    save: (input: Omit<Confiabilidade, "Id">) => Promise<Confiabilidade | RequestError>
    update: (id: number, input: Partial<Confiabilidade>) => Promise<Confiabilidade | RequestError>
    remove: (id: number) => Promise<Confiabilidade | RequestError>
}

@Injectable()
export class ConfiabilidadeAdapter implements ConfiabilidadeAdapterInterface {
    public constructor(
        @InjectRepository(Confiabilidade)
        private readonly repository: Repository<Confiabilidade>
    ) {  }

    public async findAll(region: Region): Promise<Confiabilidade[] | RequestError> {
        try {
            return await this.repository.find({
                where: { Empresa: region }
            });
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async find(id: number): Promise<Confiabilidade | RequestError> {
        try {
            return await this.repository.findOne({
                where: { Id: id }
            });
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async save(input: Omit<Confiabilidade, "Id">): Promise<Confiabilidade | RequestError> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Confiabilidade>): Promise<Confiabilidade | RequestError> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.save({
                ...record,
                ...input
            });
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async remove(id: number): Promise<Confiabilidade | RequestError> {
        try {
            const record = await this.repository.findOne({
                where: { Id: id }
            });
            return await this.repository.remove(record);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}