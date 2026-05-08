import { IDtoParser, BggThreadDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IThreadRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggThreadClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggThreadClient
    extends BaseBggClient<IThreadRequest, BggThreadDto>
    implements IBggThreadClient {
    constructor(
        builder: IQueryBuilder<IThreadRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggThreadDto>
    ) {
        super('thread', builder, fetcher, responseParser, dtoParser);
    }
}
