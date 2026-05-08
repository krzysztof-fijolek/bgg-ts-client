import { IDtoParser, BggCollectionDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { ICollectionRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggCollectionClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggCollectionClient
    extends BaseBggClient<ICollectionRequest, BggCollectionDto>
    implements IBggCollectionClient {
    constructor(
        builder: IQueryBuilder<ICollectionRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggCollectionDto>
    ) {
        super('collection', builder, fetcher, responseParser, dtoParser);
    }
}
