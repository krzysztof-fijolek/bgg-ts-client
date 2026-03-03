import { IDtoParser, BggThreadDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IThreadRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggThreadClient } from "../interface";

export class BggThreadClient implements IBggThreadClient {
    resource: string;
    builder: IQueryBuilder<IThreadRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggThreadDto>;
    constructor(
        builder: IQueryBuilder<IThreadRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggThreadDto>
      ) {
        this.resource = `${BGG_API_BASE_URL}/thread`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
      }

      async query(request: IThreadRequest): Promise<BggThreadDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('thread', error instanceof Error ? error : undefined);
        }
      }
}
