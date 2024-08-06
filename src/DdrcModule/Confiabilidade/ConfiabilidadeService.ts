import { CreateManyConfiabilidadeDto } from "./dto/CreateManyConfiabilidadeDto";
import { ConfiabilidadeAdapterInterface } from "./ConfiabilidadeAdapter";
import { CreateConfiabilidadeDto } from "./dto/CreateConfiabilidadeDto";
import { UpdateConfiabilidadeDto } from "./dto/UpdateConfiabilidadeDto";
import { GetConfiabilidadeDto } from "./dto/GetConfiabilidadeDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { Confiabilidade } from "./Confiabilidade";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";

export interface ConfiabilidadeServiceInterface {
    findAll: (region: Region) => Promise<GetConfiabilidadeDto | RequestError>
    find: (id: number) => Promise<Confiabilidade | RequestError>
    save: (input: CreateConfiabilidadeDto) => Promise<Confiabilidade | RequestError>
    saveMany: (input: CreateManyConfiabilidadeDto) => Promise<GetConfiabilidadeDto | RequestError>
    update: (id: number, input: UpdateConfiabilidadeDto) => Promise<Confiabilidade | RequestError>
    remove: (id: number) => Promise<Confiabilidade | RequestError>
    removeAll: () => Promise<GetConfiabilidadeDto | RequestError>
}

@Injectable()
export class ConfiabilidadeService implements ConfiabilidadeServiceInterface {
    public constructor(
        @Inject(Providers.CONFIABILIDADE_ADAPTER)
        private readonly adapter: ConfiabilidadeAdapterInterface
    ) {  }

    public async findAll(region: Region): Promise<GetConfiabilidadeDto | RequestError> {
        const data = await this.adapter.findAll(region);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            confiabilidade: data
        };
    }

    public async find(id: number): Promise<Confiabilidade | RequestError> {
        return await this.adapter.find(id);
    }

    public async save(input: CreateConfiabilidadeDto): Promise<Confiabilidade | RequestError> {
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyConfiabilidadeDto): Promise<GetConfiabilidadeDto | RequestError> {
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
            confiabilidade: result
        };
    }

    public async update(id: number, input: UpdateConfiabilidadeDto): Promise<Confiabilidade | RequestError> {
        return await this.adapter.update(id, input);
    }

    public async remove(id: number): Promise<Confiabilidade | RequestError> {
        return await this.adapter.remove(id);
    }

    public async removeAll(): Promise<GetConfiabilidadeDto | RequestError> {
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
            const removeResult = await this.adapter.remove(element.Id);
            if (removeResult instanceof RequestError) {
                return removeResult;
            }
            result.push(removeResult);
        });

        return {
            confiabilidade: result
        };
    }
}