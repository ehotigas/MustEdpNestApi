import { Contrato } from "../Contrato/Contrato";
import { InjectModel } from "@nestjs/mongoose";
import { Demanda } from "../Demanda/Demanda";
import { Model } from "mongoose";

export class ExportAdapter {
    public constructor(
        @InjectModel(Demanda.name)
        private readonly demandaModel: Model<Demanda>
    ) {  }

    public async generateMustDb() {
        this.demandaModel.aggregate([
            {
                $lookup: {
                    from: Contrato.name,
                    localField: '',
                    foreignField: '',
                    as: 'test'
                }
            }
        ]);
    }
}