import { RequestError } from "src/types/RequestError";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Region } from "src/types/Region";
import { Repository } from "typeorm";
import { Tarifa } from "./Tarifa";

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
        @InjectRepository(Tarifa)
        private readonly repository: Repository<Tarifa>
    ) {  }

    public async findAll(region: Region): Promise<Tarifa[] | RequestError> {
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

    public async find(id: number): Promise<Tarifa | RequestError> {
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

    public async save(input: Omit<Tarifa, "Id">): Promise<Tarifa | RequestError> {
        try {
            return await this.repository.save(input);
        }
        catch (error) {
            console.error(error);
            return new RequestError(error.message);
        }
    }

    public async update(id: number, input: Partial<Tarifa>): Promise<Tarifa | RequestError> {
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

    public async remove(id: number): Promise<Tarifa | RequestError> {
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