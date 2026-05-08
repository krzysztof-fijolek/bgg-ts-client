import { IDtoParser, BggThingDto } from '../../dto';
import { IFetcher } from '../../fetcher';
import { IRequestPaginator } from '../../paginator';
import { IQueryBuilder } from '../../query';
import { IThingRequest } from '../../request';
import { IResponseParser } from '../../responseparser';
import { THING_QUERY_LIMIT } from '../../constants';
import { IBggThingClient } from '..';
import { PaginatedBggClient } from './PaginatedBggClient';

export class BggThingClient
  extends PaginatedBggClient<IThingRequest, BggThingDto>
  implements IBggThingClient {
  constructor(
    builder: IQueryBuilder<IThingRequest>,
    fetcher: IFetcher<string, string>,
    responseParser: IResponseParser<string, any>,
    dtoParser: IDtoParser<BggThingDto>,
    paginator: IRequestPaginator
  ) {
    super('thing', THING_QUERY_LIMIT, builder, fetcher, responseParser, dtoParser, paginator);
  }
}
