import { IDtoParser, BggFamilyDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IRequestPaginator } from "../../paginator";
import { IQueryBuilder } from "../../query";
import { IFamilyRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { FAMILY_QUERY_LIMIT } from "../../constants";
import { IBggFamilyClient } from "../interface";
import { PaginatedBggClient } from "./PaginatedBggClient";

export class BggFamilyClient
    extends PaginatedBggClient<IFamilyRequest, BggFamilyDto>
    implements IBggFamilyClient {
    constructor(
        builder: IQueryBuilder<IFamilyRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggFamilyDto>,
        paginator: IRequestPaginator
    ) {
        super('family', FAMILY_QUERY_LIMIT, builder, fetcher, responseParser, dtoParser, paginator);
    }
}
