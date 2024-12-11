import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contrato } from "./contrato.entity";
import { Repository } from "typeorm";


export interface IContratoAdapter {
    save(input: Omit<Contrato, "id">): Promise<Contrato>;
    update(id: number, input: Partial<Contrato>): Promise<Contrato>;
    remove(id: number): Promise<Contrato>;
}


@Injectable()
export class ContratoAdapter implements IContratoAdapter {
    private readonly logger = new Logger(ContratoAdapter.name);
    public constructor(
        @InjectRepository(Contrato)
        private readonly repository: Repository<Contrato>
    ) {  }

    public async save(input: Omit<Contrato, "id">): Promise<Contrato> {
        try {
            return await this.repository.save(input);
        }
        catch(error) {
            this.logger.error(`Fail to save new contrato`, error.stack);
            throw new InternalServerErrorException(`Fail to save new contrato`, error.message);
        }
    }

    public async update(id: number, input: Partial<Contrato>): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.save({ ...contrato, ...input });
        }
        catch(error) {
            this.logger.error(`Fail to update contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to update contrato with id: ${id}`, error.message);
        }
    }

    public async remove(id: number): Promise<Contrato> {
        try {
            const contrato = await this.repository.findOne({
                where: { id }
            });
            return await this.repository.remove(contrato);
        }
        catch(error) {
            this.logger.error(`Fail to remove contrato with id: ${id}`, error.stack);
            throw new InternalServerErrorException(`Fail to remove contrato with id: ${id}`, error.message);
        }
    }
}