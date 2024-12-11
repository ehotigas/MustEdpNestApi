import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateParamDto } from "./dto/create-param.dto";
import { UpdateParamDto } from "./dto/update-param.dto";
import { IPontoService } from "../ponto/ponto.service";
import { GetParamDto } from "./dto/get-param.dto";
import { IParamAdapter } from "./param.adapter";
import { Ponto } from "../ponto/ponto.entity";
import { Providers } from "src/providers";
import { Posto } from "src/types/posto";
import { DataType } from "./data-type";
import { Param } from "./param.entity";
import { GetParamRequestDto } from "./dto/get-param-request.dto";


export interface IParamService {
    findAll(filters: GetParamRequestDto): Promise<GetParamDto>;
    findById(id: number): Promise<Param>;
    save(input: CreateParamDto): Promise<Param>;
    update(id: number, input: UpdateParamDto): Promise<Param>;
    remove(id: number): Promise<Param>;
}


@Injectable()
export class ParamService implements IParamService {
    private readonly logger = new Logger(ParamService.name);
    public constructor(
        @Inject(Providers.ParamAdapter)
        private readonly adapter: IParamAdapter,
        @Inject(Providers.PontoService)
        private readonly pontoService: IPontoService
    ) {  }

    public async findAll(filters: GetParamRequestDto): Promise<GetParamDto> {
        this.logger.log(`Fetching all params with: ${filters}`);
        const paramList = await this.adapter.findAll(new Param(filters));
        return {
            paramList: paramList
        };
    }

    public async findById(id: number): Promise<Param> {
        this.logger.log(`Fetching param with id: ${id}`);
        const param = await this.adapter.findById(id);
        if (!param) {
            this.logger.warn(`Fail to fetch param with id: ${id}. Not found.`);
            throw new NotFoundException(`Fail to fetch param with id: ${id}. Not found.`);
        }
        return param;
    }

    public async save(input: CreateParamDto): Promise<Param> {
        this.logger.log(`Saving new param`);
        const ponto = await this.pontoService.findById(input.ponto);
        return await this.adapter.save({
            ...input,
            ponto: ponto
        });

    }

    public async update(id: number, input: UpdateParamDto): Promise<Param> {
        this.logger.log(`Updating param with id: ${id}`);
        const param = await this.adapter.findById(id);
        if (!param) {
            this.logger.warn(`Fail to update param with id: ${id}. Not found.`);
            throw new NotFoundException(`Fail to update param with id: ${id}. Not found.`);
        }
        let ponto: Ponto = param.ponto;
        if (input?.ponto) {
            ponto = await this.pontoService.findById(input.ponto);
        }
        return await this.adapter.save({
            ...param,
            ...input,
            ponto: ponto
        });
        
    }

    public async remove(id: number): Promise<Param> {
        this.logger.log(`Removing param with id: ${id}`);
        const param = await this.adapter.findById(id);
        if (!param) {
            this.logger.warn(`Fail to remove param with id: ${id}. Not found.`);
            throw new NotFoundException(`Fail to remove param with id: ${id}. Not found.`);
        }
        return await this.adapter.remove(id);
    }
}