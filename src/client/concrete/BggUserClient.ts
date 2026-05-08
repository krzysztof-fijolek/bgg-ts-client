import { IDtoParser, BggUserDto } from "../../dto";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IUserRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { IBggUserClient } from "../interface";
import { BaseBggClient } from "./BaseBggClient";

export class BggUserClient
    extends BaseBggClient<IUserRequest, BggUserDto>
    implements IBggUserClient {
    constructor(
        builder: IQueryBuilder<IUserRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggUserDto>
    ) {
        super('user', builder, fetcher, responseParser, dtoParser);
    }
}
