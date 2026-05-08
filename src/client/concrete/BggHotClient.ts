import { IDtoParser, BggHotDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IHotItemsRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggHotClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggHotClient
    extends BaseBggClient<IHotItemsRequest, BggHotDto>
    implements IBggHotClient {
    constructor(
        builder: IQueryBuilder<IHotItemsRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggHotDto>
    ) {
        super('hot', builder, fetcher, responseParser, dtoParser);
    }
}
