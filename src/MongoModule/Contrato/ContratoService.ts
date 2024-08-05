import { CreateManyContratoDto } from "./dto/CreateManyContratoDto";
import { ContratoAdapterInterface } from "./ContratoAdapter";
import { CreateContratoDto } from "./dto/CreateContratoDto";
import { UpdateContratoDto } from "./dto/UpdateContratoDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { GetContratoDto } from "./dto/GetContratoDto";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Contrato } from "./Contrato";

export interface ContratoServiceInterface {
    findAll: (region: Region) => Promise<GetContratoDto | RequestError>
    find: (id: number) => Promise<Contrato | RequestError>
    save: (input: CreateContratoDto) => Promise<Contrato | RequestError>
    saveMany: (input: CreateManyContratoDto) => Promise<GetContratoDto | RequestError>
    update: (id: number, input: UpdateContratoDto) => Promise<Contrato | RequestError>
    remove: (id: number) => Promise<Contrato | RequestError>
    removeAll: () => Promise<GetContratoDto | RequestError>
}

@Injectable()
export class ContratoService implements ContratoServiceInterface {
    public constructor(
        @Inject(Providers.CONTRATO_ADAPTER)
        private readonly adapter: ContratoAdapterInterface
    ) {  }

    public async findAll(region: Region): Promise<GetContratoDto | RequestError> {
        const data = await this.adapter.findAll(region);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            contrato: data
        };
    }

    public async find(id: number): Promise<Contrato | RequestError> {
        return await this.adapter.find(id);
    }

    public async save(input: CreateContratoDto): Promise<Contrato | RequestError> {
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyContratoDto): Promise<GetContratoDto | RequestError> {
        const result = [];
        for (let index = 0; index < input.payload.length; index++) {
            const element = input.payload[index];
            const saveResult = await this.adapter.save(element);
            if (saveResult instanceof RequestError) {
                return saveResult;
            }
            result.push(saveResult);
        }
        return {
            contrato: result
        };
    }

    public async update(id: number, input: UpdateContratoDto): Promise<Contrato | RequestError> {
        return await this.adapter.update(id, input);
    }

    public async remove(id: number): Promise<Contrato | RequestError> {
        return await this.adapter.remove(id);
    }

    public async removeAll(): Promise<GetContratoDto | RequestError> {
        const spLines = await this.adapter.findAll(Region.SP);
        if (spLines instanceof RequestError) {
            return spLines;
        }
        const esLines = await this.adapter.findAll(Region.ES);
        if (esLines instanceof RequestError) {
            return esLines;
        }

        const result = [];
        const lines = [...spLines, ...esLines];
        lines.forEach(async (element) => {
            const removeResult = await this.adapter.remove(element._id);
            if (removeResult instanceof RequestError) {
                return removeResult;
            }
            result.push(removeResult);
        });

        return {
            contrato: result
        };
    }
}