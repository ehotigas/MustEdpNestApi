import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Contrato } from "./Contrato";
import { Model } from "mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export interface ContratoAdapterInterface {
    findAll: (region: Region) => Promise<Contrato[] | RequestError>
    find: (id: number) => Promise<Contrato | RequestError>
    save: (input: Omit<Contrato, "Id">) => Promise<Contrato | RequestError>
    update: (id: number, input: Partial<Contrato>) => Promise<Contrato | RequestError>
    remove: (id: number) => Promise<Contrato | RequestError>
}

@Injectable()
export class ContratoAdapter implements ContratoAdapterInterface {
    public constructor(
        @InjectRepository(Contrato)
        private readonly repository: Repository<Contrato>
    ) {  }

    public async findAll(region: Region): Promise<Contrato[] | RequestError> {
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

    public async find(id: number): Promise<Contrato | RequestError> {
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

    public async save(input: Omit<Contrato, "Id">): Promise<Contrato | RequestError> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato | RequestError> {
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

    public async remove(id: number): Promise<Contrato | RequestError> {
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