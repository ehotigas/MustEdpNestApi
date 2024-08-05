import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Demanda } from "./Demanda";
import { Model } from "mongoose";

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
        @InjectModel(Demanda.name)
        private readonly model: Model<Demanda>
    ) {  }

    public async findAll(region: Region): Promise<Demanda[] | RequestError> {
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

    public async find(id: number): Promise<Demanda | RequestError> {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async save(input: Omit<Demanda, "Id">): Promise<Demanda | RequestError> {
        try {
            return await this.model.create(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Demanda>): Promise<Demanda | RequestError> {
        try {
            return await this.model.findByIdAndUpdate(id, input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async remove(id: number): Promise<Demanda | RequestError> {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}