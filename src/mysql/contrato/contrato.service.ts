import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { GenerateContractDto } from "./dto/generate-contract.dto";
import { CreateContratoDto } from "./dto/create-contrato.dto";
import { UpdateContratoDto } from "./dto/update-contrato.dto";
import { IParamService } from "../param/param.service";
import { IContratoAdapter } from "./contrato.adapter";
import { DataType } from "../param/data-type";
import { Contrato } from "./contrato.entity";
import { Providers } from "src/providers";


export interface IContratoService {
    generate(year: number): Promise<GenerateContractDto>;
    save(input: CreateContratoDto): Promise<Contrato>;
    update(id: number, input: UpdateContratoDto): Promise<Contrato>;
    remove(id: number): Promise<Contrato>;
}


@Injectable()
export class ContratoService implements IContratoService {
    private readonly logger = new Logger(ContratoService.name);
    public constructor(
        @Inject(Providers.ContratoAdapter)
        private readonly adapter: IContratoAdapter,
        @Inject(Providers.ParamService)
        private readonly paramService: IParamService
    ) {  }

    public async generate(year: number): Promise<GenerateContractDto> {
        this.logger.log(`Generating contracts for year ${year}`);
        return {
            message: await this.adapter.generate(year)
        };
    }

    public async save(input: CreateContratoDto): Promise<Contrato> {
        this.logger.log(`Saving new contrato`);
        const demanda = await this.paramService.findById(input.demanda);
        if (demanda.tipoDado != DataType.DEMANDA) {
            throw new BadRequestException(`Fail to create new contrato, param DataType should be DEMANDA`);
        }
        const contrato = await this.adapter.findByDemanda(demanda);
        if (contrato && new Date() >= demanda.data) throw new BadRequestException(`Fail to save contrato, this data is before than now.`);
        if (contrato) {
            return await this.adapter.update(contrato.id, { ...contrato, valor: input.valor });
        }
        return await this.adapter.save({ ...input, demanda: demanda });
    }

    public async update(id: number, input: UpdateContratoDto): Promise<Contrato> {
        this.logger.log(`Updating contrato with id: ${id}`);
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
}