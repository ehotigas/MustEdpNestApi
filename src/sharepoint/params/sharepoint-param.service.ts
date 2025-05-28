import { ISharepointParamAdapter } from "./sharepoint-param.adapter";
import { CreateParamDto } from "src/mysql/param/dto/create-param.dto";
import { IParamService } from "src/mysql/param/param.service";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { UpdateParamDto } from "./dto/update-param.dto";
import { Providers } from "src/Providers";


export interface ISharepointParamService {
    findAll(): Promise<CreateParamDto[]>;
    updateAll(): Promise<UpdateParamDto>;
}

@Injectable()
export class SharepointParamService implements ISharepointParamService {
    private readonly logger = new Logger(SharepointParamService.name);
    public constructor(
        @Inject(Providers.SharepointParamAdapter) private readonly adapter: ISharepointParamAdapter,
        @Inject(Providers.ParamService) private readonly paramService: IParamService
    ) {  }

    public async findAll(): Promise<CreateParamDto[]> {
        return await this.adapter.findAll();
    }

    public async updateAll(): Promise<UpdateParamDto> {
        this.logger.log(`Updating all param records`)
        try {
            const data = await this.findAll();
            for (const row of data) await this.paramService.save(row);
            return { updated: true, message: "Update successful" };
        } catch(error) {
            return { updated: true, message: `Fail to update param: ${error.stack}` };
        }
    }
}