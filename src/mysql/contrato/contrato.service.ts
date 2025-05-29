import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateManyByDemandaResponseDto } from "./dto/create-many-by-demanda-response.dto";
import { GetContratoTableFilterDto } from "./dto/get-contrato-table-filter.dto";
import { CreateManyByDemandaDto } from "./dto/create-many-by-demanda.dto";
import { GetContratoTableDto } from "./dto/get-contrato-table.dto";
import { GenerateContractDto } from "./dto/generate-contract.dto";
import { CreateByDemandaDto } from "./dto/create-by-demanda.dto";
import { RemoveByCenarioDto } from "./dto/remove-by-cenario.dto";
import { CreateContratoDto } from "./dto/create-contrato.dto";
import { UpdateContratoDto } from "./dto/update-contrato.dto";
import { IParamService } from "../param/param.service";
import { IPontoService } from "../ponto/ponto.service";
import { IContratoAdapter } from "./contrato.adapter";
import { DataType } from "../param/data-type";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";
import { GetSimuladorContratoTableDto } from "./dto/get-simulador-contrato-table.dto";


export interface IContratoService {
    findContratoTable(ponto: string, ano: number, cenario: string): Promise<GetContratoTableDto>;
    generate(year: number): Promise<GenerateContractDto>;
    save(input: CreateContratoDto): Promise<Contrato>;
    findTableFilters(): Promise<GetContratoTableFilterDto>;
    findSimuladorContratoTable(cenario: string, ano: number): Promise<GetSimuladorContratoTableDto>;
    saveByDemanda(input: CreateByDemandaDto): Promise<Contrato>;
    saveManyByDemanda(input: CreateManyByDemandaDto): Promise<CreateManyByDemandaResponseDto>;
    update(id: number, input: UpdateContratoDto): Promise<Contrato>;
    remove(id: number): Promise<Contrato>;
    removeByCenario(cenario: string): Promise<RemoveByCenarioDto>;
}


@Injectable()
export class ContratoService implements IContratoService {
    private readonly logger = new Logger(ContratoService.name);
    public constructor(
        @Inject(Providers.ContratoAdapter)
        private readonly adapter: IContratoAdapter,
        @Inject(Providers.ParamService)
        private readonly paramService: IParamService,
        @Inject(Providers.PontoService)
        private readonly pontoService: IPontoService,
    ) {  }

    public async findContratoTable(ponto: string, ano: number, cenario: string): Promise<GetContratoTableDto> {
        this.logger.log(`Fetching contrato table for ponto: ${ponto}, ano: ${ano}, cenario: ${cenario}`);
        return {
            data: await this.adapter.findContratoTable(ponto, ano, cenario)
        }
    }

    public async findTableFilters(): Promise<GetContratoTableFilterDto> {
        this.logger.log(`Fetching contrato table filter options`);
        return await this.adapter.findTableFilters();
    }

    public async findSimuladorContratoTable(cenario: string, ano: number): Promise<GetSimuladorContratoTableDto> {
        this.logger.log(`Fetching simulador contrato table with cenario: ${cenario}, ano: ${ano}`);
        return {
            data: await this.adapter.findSimuladorContratoTable(cenario, ano)
        };
    }



    public async generate(year: number): Promise<GenerateContractDto> {
        this.logger.log(`Generating contracts for year ${year}`);
        return {
            message: await this.adapter.generate(year)
        };
    }

    public async saveByDemanda(input: CreateByDemandaDto): Promise<Contrato> {
        this.logger.log(`Saving new contrato by demanda`);
        if (input.valor == null || isNaN(input.valor)) input.valor = 0;
        const ponto = await this.pontoService.findById(input.ponto);
        let demanda = await this.paramService.findByPontoAndPostoAndDataAndTipoDadoAndCenario(ponto, input.posto, input.data, DataType.DEMANDA, input.cenario);
        if (new Date(input.data) < new Date()) {
            input.cenario = "Realizado";
        }
        if (!demanda) {
            demanda = await this.paramService.save({ ...input, tipoDado: DataType.DEMANDA, valor: null });
        }
        return await this.save({ demanda: demanda.id, valor: input.valor });
    }

    public async saveManyByDemanda(input: CreateManyByDemandaDto): Promise<CreateManyByDemandaResponseDto> {
        this.logger.log(`Saving many contrato by demanda`);
        for (const payload of input.payload) {
            await this.saveByDemanda(payload);
        }
        return { ok: true };
    }

    public async save(input: CreateContratoDto): Promise<Contrato> {
        this.logger.log(`Saving new contrato`);
        if (input.valor == null || isNaN(input.valor)) input.valor = 0;
        const demanda = await this.paramService.findById(input.demanda);
        if (demanda.tipoDado !== DataType.DEMANDA) {
            throw new BadRequestException(`Fail to create new contrato, param DataType should be DEMANDA`);
        }
        const contrato = await this.adapter.findByDemanda(demanda);
        // if (contrato && new Date() >= demanda.data) throw new BadRequestException(`Fail to save contrato, this data is before than now.`);
        if (contrato) {
            return await this.adapter.update(contrato.id, { ...contrato, valor: input.valor });
        }
        return await this.adapter.save({ ...input, demanda: demanda });
    }

    public async update(id: number, input: UpdateContratoDto): Promise<Contrato> {
        this.logger.log(`Updating contrato with id: ${id}`);
        if (input.valor == null || isNaN(input.valor)) input.valor = 0;
        const contrato = await this.adapter.update(id, input);
        if (!contrato) {
            this.logger.warn(`Fail to update contrato with id: ${id}. Not found.`);
            throw new NotFoundException(`Fail to update contrato with id: ${id}. Not found.`);
        }
        return contrato;
    }

    public async remove(id: number): Promise<Contrato> {
        this.logger.log(`Removing contrato with id: ${id}`);
        const contrato = await this.adapter.remove(id);
        if (!contrato) {
            this.logger.warn(`Fail to remove contrato with id: ${id}. Not found.`);
            throw new NotFoundException(`Fail to remove contrato with id: ${id}. Not found.`);
        }
        return contrato;
    }

    public async removeByCenario(cenario: string): Promise<RemoveByCenarioDto> {
        this.logger.log(`Removing contrato: ${cenario}`);
        return {
            ok: await this.adapter.removeByCenario(cenario)
        };
    }
}