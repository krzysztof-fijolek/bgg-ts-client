import { IDtoParser, BggGuildDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IGuildRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggGuildClient } from "../interface";

export class BggGuildClient implements IBggGuildClient {
    resource: string;
    builder: IQueryBuilder<IGuildRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggGuildDto>;
    constructor(
        builder: IQueryBuilder<IGuildRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggGuildDto>
    ) {
        this.resource = `${BGG_API_BASE_URL}/guild`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
    }
    async query(request: IGuildRequest): Promise<BggGuildDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('guild', error instanceof Error ? error : undefined);
        }
    }
}
