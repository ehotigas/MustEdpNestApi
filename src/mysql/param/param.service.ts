import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyParamResponseDto } from "./dto/create-many-param-response.dto";
import { CreateManyParamDto } from "./dto/create-many-param.dto";
import { GetParamRequestDto } from "./dto/get-param-request.dto";
import { CreateParamDto } from "./dto/create-param.dto";
import { UpdateParamDto } from "./dto/update-param.dto";
import { IPontoService } from "../ponto/ponto.service";
import { GetParamDto } from "./dto/get-param.dto";
import { IParamAdapter } from "./param.adapter";
import { Ponto } from "../ponto/ponto.entity";
import { Providers } from "src/providers";
import { Param } from "./param.entity";
import { DataType } from "./data-type";
import { Posto } from "src/types/posto";
import { GetFilterHeaderDto } from "./dto/get-filter-header.dto";
import { GetParamTableDto } from "./dto/get-param-table.dto";


export interface IParamService {
    findAll(filters: GetParamRequestDto): Promise<GetParamDto>;
    findById(id: number): Promise<Param>;
    findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date, tipoDado: DataType, cenario: string): Promise<Param>;
    findParamTable(ponto: string, ano: number, cenario: string): Promise<GetParamTableDto>;
    getFilterHeader(): Promise<GetFilterHeaderDto>;
    save(input: CreateParamDto): Promise<Param>;
    saveMany(input: CreateManyParamDto): Promise<CreateManyParamResponseDto>;
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

    public async findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto: Ponto, posto: Posto, data: Date, tipoDado: DataType, cenario: string): Promise<Param> {
        this.logger.log(`Fetching param with ponto: ${ponto}, posto: ${posto}, data: ${data}, tipoDado: ${tipoDado}, cenario: ${cenario}`);
        return await this.adapter.findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto, posto, data, tipoDado, cenario);
    }

    public async findParamTable(ponto: string, ano: number, cenario: string): Promise<GetParamTableDto> {
        this.logger.log(`fetching param table with: ponto: ${ponto}, ano: ${ano}, cenario: ${cenario}`);
        return {
            table: await this.adapter.findParamTable(ponto, ano, cenario)
        };
    }

    public async getFilterHeader(): Promise<GetFilterHeaderDto> {
        this.logger.log(`Fetching filter headers`);
        return await this.adapter.getFilterHeader();
    }

    public async save(input: CreateParamDto): Promise<Param> {
        this.logger.log(`Saving new param`);
        const ponto = await this.pontoService.findById(input.ponto);
        if (input.tipoDado === DataType.CONFIABILIDADE) {
            input.cenario = null;
        }
        if (input.tipoDado === DataType.TARIFA && !["DRA", "DRP"].includes(input.cenario)) {
            throw new BadRequestException(`Fail to save new param. Tarifa's cenario should be ("DRA", "DRP")`);
        }
        if (input.tipoDado === DataType.DEMANDA && new Date(input.data) < new Date()) {
            input.cenario = "Realizado";
        }
        // if (param && input.data < new Date()) throw new BadRequestException(`Fail to save param ${input.tipoDado}, this data param is before than now.`);
        const param = await this.adapter.findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto, input.posto, input.data, input.tipoDado, input.cenario);
        if (param) return await this.update(param.id, input);
        return await this.adapter.save({
            ...input,
            ponto: ponto
        });
    }

    public async saveMany(input: CreateManyParamDto): Promise<CreateManyParamResponseDto> {
        for (let inputIndex = 0; inputIndex < input.payload.length; inputIndex++) {
            await this.save(input.payload[inputIndex]);
        }
        return { ok: true };
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