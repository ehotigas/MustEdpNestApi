import { CreateManyTarifaDto } from "./dto/CreateManyTarifaDto";
import { TarifaAdapterInterface } from "./TarifaAdapter";
import { CreateTarifaDto } from "./dto/CreateTarifaDto";
import { UpdateTarifaDto } from "./dto/UpdateTarifaDto";
import { RequestError } from "src/types/RequestError";
import { Inject, Injectable } from "@nestjs/common";
import { GetTarifaDto } from "./dto/GetTarifaDto";
import { Region } from "src/types/Region";
import { Providers } from "src/Providers";
import { Tarifa } from "./Tarifa";

export interface TarifaServiceInterface {
    findAll: (region: Region) => Promise<GetTarifaDto | RequestError>
    find: (id: number) => Promise<Tarifa | RequestError>
    save: (input: CreateTarifaDto) => Promise<Tarifa | RequestError>
    saveMany: (input: CreateManyTarifaDto) => Promise<GetTarifaDto | RequestError>
    update: (id: number, input: UpdateTarifaDto) => Promise<Tarifa | RequestError>
    remove: (id: number) => Promise<Tarifa | RequestError>
    removeAll: () => Promise<GetTarifaDto | RequestError>
}

@Injectable()
export class TarifaService implements TarifaServiceInterface {
    public constructor(
        @Inject(Providers.TARIFA_ADAPTER)
        private readonly adapter: TarifaAdapterInterface
    ) {  }

    public async findAll(region: Region): Promise<GetTarifaDto | RequestError> {
        const data = await this.adapter.findAll(region);
        if (data instanceof RequestError) {
            return data;
        }
        return {
            tarifa: data
        };
    }

    public async find(id: number): Promise<Tarifa | RequestError> {
        return await this.adapter.find(id);
    }

    public async save(input: CreateTarifaDto): Promise<Tarifa | RequestError> {
        return await this.adapter.save(input);
    }

    public async saveMany(input: CreateManyTarifaDto): Promise<GetTarifaDto | RequestError> {
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
            tarifa: result
        };
    }

    public async update(id: number, input: UpdateTarifaDto): Promise<Tarifa | RequestError> {
        return await this.adapter.update(id, input);
    }

    public async remove(id: number): Promise<Tarifa | RequestError> {
        return await this.adapter.remove(id);
    }

    public async removeAll(): Promise<GetTarifaDto | RequestError> {
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
            tarifa: result
        };
    }
}