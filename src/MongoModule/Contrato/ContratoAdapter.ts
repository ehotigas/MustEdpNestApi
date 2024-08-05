import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Contrato } from "./Contrato";
import { Model } from "mongoose";

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
        @InjectModel(Contrato.name)
        private readonly model: Model<Contrato>
    ) {  }

    public async findAll(region: Region): Promise<Contrato[] | RequestError> {
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

    public async find(id: number): Promise<Contrato | RequestError> {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async save(input: Omit<Contrato, "Id">): Promise<Contrato | RequestError> {
        try {
            return await this.model.create(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato | RequestError> {
        try {
            return await this.model.findByIdAndUpdate(id, input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async remove(id: number): Promise<Contrato | RequestError> {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}