import { IDtoParser, BggSearchDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { ISearchRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggSearchClient } from "../interface/IBggClients";

export class BggSearchClient implements IBggSearchClient {
    resource: string;
    builder: IQueryBuilder<ISearchRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggSearchDto>;
    constructor(
        builder: IQueryBuilder<ISearchRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggSearchDto>
    ) {
        this.resource = `${BGG_API_BASE_URL}/search`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
    }

    async query(request: ISearchRequest): Promise<BggSearchDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('search', error instanceof Error ? error : undefined);
        }
    }

}
