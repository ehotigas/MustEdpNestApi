import { CreateByDemandaDto } from "src/mysql/contrato/dto/create-by-demanda.dto";
import { ISharepointContratoAdapter } from "./sharepoint-contrato.adapter";
import { IContratoService } from "src/mysql/contrato/contrato.service";
import { UpdateContratoDto } from "./dto/update-contrato.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Providers } from "src/Providers";


export interface ISharepointContratoService {
    findAll(): Promise<CreateByDemandaDto[]>;
    updateAll(): Promise<UpdateContratoDto>;
}

@Injectable()
export class SharepointContratoService implements ISharepointContratoService {
    private readonly logger = new Logger(SharepointContratoService.name);
    public constructor(
        @Inject(Providers.SharepointContratoAdapter) private readonly adapter: ISharepointContratoAdapter,
        @Inject(Providers.ContratoService) private readonly paramService: IContratoService
    ) {  }

    public async findAll(): Promise<CreateByDemandaDto[]> {
        return await this.adapter.findAll();
    }

    public async updateAll(): Promise<UpdateContratoDto> {
        this.logger.log(`Updating all contrato records`)
        try {
            const data = await this.findAll();
            for (const row of data) await this.paramService.saveByDemanda(row);
            return { updated: true, message: "Update successful" };
        } catch(error) {
            return { updated: true, message: `Fail to update param: ${error.stack}` };
        }
    }
}