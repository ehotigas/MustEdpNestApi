import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Confiabilidade } from "./Confiabilidade";
import { Model } from "mongoose";

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
        @InjectModel(Confiabilidade.name)
        private readonly model: Model<Confiabilidade>
    ) {  }

    public async findAll(region: Region): Promise<Confiabilidade[] | RequestError> {
        try {
            return await this.model.find({
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
            return await this.model.findById(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async save(input: Omit<Confiabilidade, "Id">): Promise<Confiabilidade | RequestError> {
        try {
            return await this.model.create(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Confiabilidade>): Promise<Confiabilidade | RequestError> {
        try {
            return await this.model.findByIdAndUpdate(id, input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async remove(id: number): Promise<Confiabilidade | RequestError> {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}