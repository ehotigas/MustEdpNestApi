import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface DatabricksAdapterInterface {
    clusterId: string;
    token: string;
    url: string;
    fetch: (uri: string, init: AxiosRequestConfig<string>) => Promise<AxiosResponse<any, any>>
}

@Injectable()
export class DatabricksAdapter implements DatabricksAdapterInterface {
    public readonly clusterId: string;
    public readonly token: string;
    public readonly url: string;
    public constructor() {
        this.clusterId = "0904-165653-carry93";
        this.url = "https://adb-6549464872659391.11.azuredatabricks.net";
        this.token = "dapi8e691397c2be956cc529cdfbfe56714b";
    }

    public async fetch(uri: string, init: AxiosRequestConfig<string>): Promise<AxiosResponse<any, any>> {
        const data = JSON.stringify({
            cluster_id: this.clusterId,
            ...JSON.parse(init.data || "{}")
        });
        return await axios(
            `${this.url}${uri}`,
            {
                ...init,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    ...init.headers || {  }
                },
                data: data,
            }
        );
    }
}