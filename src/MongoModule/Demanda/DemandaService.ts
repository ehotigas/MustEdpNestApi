import { CreateManyDemandaDto } from "./dto/CreateManyDemandaDto";
import { DemandaAdapterInterface } from "./DemandaAdapter";
import { CreateDemandaDto } from "./dto/CreateDemandaDto";
import { UpdateDemandaDto } from "./dto/UpdateDemandaDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { GetDemandaDto } from "./dto/GetDemandaDto";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Demanda } from "./Demanda";

export interface DemandaServiceInterface {
    findAll: (region: Region) => Promise<GetDemandaDto | RequestError>
    find: (id: number) => Promise<Demanda | RequestError>
    save: (input: CreateDemandaDto) => Promise<Demanda | RequestError>
    saveMany: (input: CreateManyDemandaDto) => Promise<GetDemandaDto | RequestError>
    update: (id: number, input: UpdateDemandaDto) => Promise<Demanda | RequestError>
    remove: (id: number) => Promise<Demanda | RequestError>
    removeAll: () => Promise<GetDemandaDto | RequestError>
}

@Injectable()
export class DemandaService implements DemandaServiceInterface {
    public constructor(
        @Inject(Providers.DEMANDA_ADAPTER)
        private readonly adapter: DemandaAdapterInterface
    ) {  }

    public async findAll(region: Region): Promise<GetDemandaDto | RequestError> {
        const data = await this.adapter.findAll(region);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            demanda: data
        };
    }

    public async find(id: number): Promise<Demanda | RequestError> {
        return await this.adapter.find(id);
    }

    public async save(input: CreateDemandaDto): Promise<Demanda | RequestError> {
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyDemandaDto): Promise<GetDemandaDto | RequestError> {
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
            demanda: result
        };
    }

    public async update(id: number, input: UpdateDemandaDto): Promise<Demanda | RequestError> {
        return await this.adapter.update(id, input);
    }

    public async remove(id: number): Promise<Demanda | RequestError> {
        return await this.adapter.remove(id);
    }

    public async removeAll(): Promise<GetDemandaDto | RequestError> {
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
            demanda: result
        };
    }
}