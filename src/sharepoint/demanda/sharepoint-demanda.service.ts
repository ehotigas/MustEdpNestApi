import { ISharepointDemandaAdapter } from "./sharepoint-demanda.adapter";
import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { IParamService } from "src/mysql/param/param.service";
import { UpdateDemandaDto } from "./dto/update-demanda.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";

export interface ISharepointDemandaService {
    findAll(): Promise<CreateParamDto[]>;
    updateAll(): Promise<UpdateDemandaDto>;
}

@Injectable()
export class SharepointDemandaService implements ISharepointDemandaService {
    private readonly logger = new Logger(SharepointDemandaService.name);
    public constructor(
        @Inject(Providers.SharepointDemandaAdapter) private readonly adapter: ISharepointDemandaAdapter,
        @Inject(Providers.ParamService) private readonly paramService: IParamService
    ) {  }

    public async findAll(): Promise<CreateParamDto[]> {
        return await this.adapter.findAll();
    }

    public async updateAll(): Promise<UpdateDemandaDto> {
        this.logger.log(`Updating all demand records`)
        try {
            const data = await this.findAll();
            for (const row of data) await this.paramService.save(row);
            return { updated: true, message: "Update successful" };
        } catch(error) {
            return { updated: true, message: `Fail to update demanda: ${error.stack}` };
        }
    }
}