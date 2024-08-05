import { RequestError } from "src/types/RequestError";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Tarifa } from "./Tarifa";
import { Model } from "mongoose";

export interface TarifaAdapterInterface {
    findAll: (region: Region) => Promise<Tarifa[] | RequestError>
    find: (id: number) => Promise<Tarifa | RequestError>
    save: (input: Omit<Tarifa, "Id">) => Promise<Tarifa | RequestError>
    update: (id: number, input: Partial<Tarifa>) => Promise<Tarifa | RequestError>
    remove: (id: number) => Promise<Tarifa | RequestError>
}

@Injectable()
export class TarifaAdapter implements TarifaAdapterInterface {
    public constructor(
        @InjectModel(Tarifa.name)
        private readonly model: Model<Tarifa>
    ) {  }

    public async findAll(region: Region): Promise<Tarifa[] | RequestError> {
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

    public async find(id: number): Promise<Tarifa | RequestError> {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async save(input: Omit<Tarifa, "Id">): Promise<Tarifa | RequestError> {
        try {
            return await this.model.create(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Tarifa>): Promise<Tarifa | RequestError> {
        try {
            return await this.model.findByIdAndUpdate(id, input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async remove(id: number): Promise<Tarifa | RequestError> {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }
}