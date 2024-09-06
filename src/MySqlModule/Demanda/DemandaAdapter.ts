import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Demanda } from "./Demanda";
import { Model } from "mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export interface DemandaAdapterInterface {
    findAll: (region: Region) => Promise<Demanda[] | RequestError>
    find: (id: number) => Promise<Demanda | RequestError>
    save: (input: Omit<Demanda, "Id">) => Promise<Demanda | RequestError>
    update: (id: number, input: Partial<Demanda>) => Promise<Demanda | RequestError>
    remove: (id: number) => Promise<Demanda | RequestError>
}

@Injectable()
export class DemandaAdapter implements DemandaAdapterInterface {
    public constructor(
        @InjectRepository(Demanda)
        private readonly repository: Repository<Demanda>
    ) {  }

    public async findAll(region: Region): Promise<Demanda[] | RequestError> {
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

    public async find(id: number): Promise<Demanda | RequestError> {
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

    public async save(input: Omit<Demanda, "Id">): Promise<Demanda | RequestError> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Demanda>): Promise<Demanda | RequestError> {
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

    public async remove(id: number): Promise<Demanda | RequestError> {
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