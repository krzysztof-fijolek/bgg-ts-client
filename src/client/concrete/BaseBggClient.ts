import { IBggDto, IDtoParser } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IQueryBuilder } from "../../query";
import { IRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL } from "../../constants";

export abstract class BaseBggClient<TRequest extends IRequest, TDto extends IBggDto> {
    readonly resource: string;
    readonly builder: IQueryBuilder<TRequest>;
    readonly fetcher: IFetcher<string, string>;
    readonly responseParser: IResponseParser<string, any>;
    readonly dtoParser: IDtoParser<TDto>;
    protected readonly endpointName: string;

    constructor(
        endpointName: string,
        builder: IQueryBuilder<TRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<TDto>
    ) {
        this.endpointName = endpointName;
        this.resource = `${BGG_API_BASE_URL}/${endpointName}`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
    }

    async query(request: TRequest): Promise<TDto[]> {
        try {
            return await this.internalQuery(request);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError(this.endpointName, error instanceof Error ? error : undefined);
        }
    }

    protected async internalQuery(request: TRequest): Promise<TDto[]> {
        const querystring = this.builder.build(request);
        const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
        const jsonData = await this.responseParser.parseResponse(xml);
        return await this.dtoParser.jsonToDto(jsonData);
    }
}
