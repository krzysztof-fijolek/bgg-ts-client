import { IDtoParser, BggSearchDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { ISearchRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggSearchClient } from "../interface/IBggClients";
import { BaseBggClient } from "./BaseBggClient";

export class BggSearchClient
    extends BaseBggClient<ISearchRequest, BggSearchDto>
    implements IBggSearchClient {
    constructor(
        builder: IQueryBuilder<ISearchRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggSearchDto>
    ) {
        super('search', builder, fetcher, responseParser, dtoParser);
    }
}
