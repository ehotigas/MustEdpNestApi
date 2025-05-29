import { ISharepointDemandaRealizadaAdapter } from "./sharepoint-demanda-realizada.adapter";
import { SharepointDemandaTableDto } from "./dto/sharepoint-demanda-table.dto";
import { UpdateDemandaRealizadaDto } from "./dto/update-demanda-realizada.dto";
import { IParamService } from "src/mysql/param/param.service";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Providers } from "src/Providers";
import { Region } from "src/types/region";
import { IContratoService } from "src/mysql/contrato/contrato.service";

export interface ISharepointDemandaRealizadaService {
    findAll(): Promise<SharepointDemandaTableDto[]>;
    updateAll(): Promise<UpdateDemandaRealizadaDto>;
}

@Injectable()
export class SharepointDemandaRealizadaService implements ISharepointDemandaRealizadaService {
    private readonly logger = new Logger(SharepointDemandaRealizadaService.name);
    public constructor(
        @Inject(Providers.SharepointDemandaRealizadaAdapter) private readonly adapter: ISharepointDemandaRealizadaAdapter,
        @Inject(Providers.ParamService) private readonly paramService: IParamService,
        @Inject(Providers.ContratoService) private readonly contratoService: IContratoService
    ) {  }

    public async findAll(): Promise<SharepointDemandaTableDto[]> {
        return await this.adapter.findAll();
    }

    public async updateAll(): Promise<UpdateDemandaRealizadaDto> {
        this.logger.log(`Updating all demand records`)
        try {
            const data = await this.findAll();
            for (const row of data) {
                if (row.type === "param") await this.paramService.save(row.dto);
                else await this.contratoService.saveByDemanda({ cenario: row.dto.cenario, data: row.dto.data, ponto: row.dto.ponto, posto: row.dto.posto, valor: row.dto.valor });
            }
            return { updated: true, message: "Update successful" };
        } catch(error) {
            return { updated: true, message: `Fail to update demanda: ${error.stack}` };
        }
    }
}