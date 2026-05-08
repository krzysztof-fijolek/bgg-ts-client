import { IDtoParser, BggPlayDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IPlaysRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggPlaysClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggPlayClient
    extends BaseBggClient<IPlaysRequest, BggPlayDto>
    implements IBggPlaysClient {
    constructor(
        builder: IQueryBuilder<IPlaysRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggPlayDto>
    ) {
        super('plays', builder, fetcher, responseParser, dtoParser);
    }
}
