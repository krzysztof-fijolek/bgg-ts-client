import { IDtoParser, BggPlayDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IPlaysRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggPlaysClient } from "../interface";

export class BggPlayClient implements IBggPlaysClient {
    resource: string;
    builder: IQueryBuilder<IPlaysRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggPlayDto>;
    constructor(
        builder: IQueryBuilder<IPlaysRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggPlayDto>
      ) {
        this.resource = `${BGG_API_BASE_URL}/plays`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
      }

      async query(request: IPlaysRequest): Promise<BggPlayDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('plays', error instanceof Error ? error : undefined);
        }
      }
}
