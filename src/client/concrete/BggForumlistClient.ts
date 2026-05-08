import { IDtoParser, BggForumlistDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IRequestPaginator } from "../../paginator";
import { IQueryBuilder } from "../../query";
import { IForumlistRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { FORUMLIST_QUERY_LIMIT } from "../../constants";
import { IBggForumlistClient } from "../interface/IBggClients";
import { PaginatedBggClient } from "./PaginatedBggClient";

export class BggForumlistClient
    extends PaginatedBggClient<IForumlistRequest, BggForumlistDto>
    implements IBggForumlistClient {
    constructor(
        builder: IQueryBuilder<IForumlistRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggForumlistDto>,
        paginator: IRequestPaginator
    ) {
        super('forumlist', FORUMLIST_QUERY_LIMIT, builder, fetcher, responseParser, dtoParser, paginator);
    }
}
