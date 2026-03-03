import { IDtoParser, BggHotDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IHotItemsRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggHotClient } from "../interface";

export class BggHotClient implements IBggHotClient {
    resource: string;
    builder: IQueryBuilder<IHotItemsRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggHotDto>;

    constructor(
        builder: IQueryBuilder<IHotItemsRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggHotDto>
    ) {
        this.resource = `${BGG_API_BASE_URL}/hot`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
    }


    async query(request: IHotItemsRequest): Promise<BggHotDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('hot', error instanceof Error ? error : undefined);
        }
    }

}
