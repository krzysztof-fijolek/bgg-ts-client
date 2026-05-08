import { IDtoParser, BggForumDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IForumRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggForumClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggForumClient
    extends BaseBggClient<IForumRequest, BggForumDto>
    implements IBggForumClient {
    constructor(
        builder: IQueryBuilder<IForumRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggForumDto>
    ) {
        super('forum', builder, fetcher, responseParser, dtoParser);
    }
}
