import { IDtoParser, BggUserDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IUserRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";
import { IBggUserClient } from "../interface";

export class BggUserClient implements IBggUserClient {
    resource: string;
    builder: IQueryBuilder<IUserRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggUserDto>;
    constructor(
        builder: IQueryBuilder<IUserRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggUserDto>
      ) {
        this.resource = `${BGG_API_BASE_URL}/user`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
      }

      async query(request: IUserRequest): Promise<BggUserDto[]> {
        try {
            const querystring = this.builder.build(request);
            const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
            const jsonData = await this.responseParser.parseResponse(xml);
            return await this.dtoParser.jsonToDto(jsonData);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('user', error instanceof Error ? error : undefined);
        }
      }
}
