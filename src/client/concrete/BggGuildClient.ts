import { IDtoParser, BggGuildDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IGuildRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggGuildClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggGuildClient
    extends BaseBggClient<IGuildRequest, BggGuildDto>
    implements IBggGuildClient {
    constructor(
        builder: IQueryBuilder<IGuildRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggGuildDto>
    ) {
        super('guild', builder, fetcher, responseParser, dtoParser);
    }
}
