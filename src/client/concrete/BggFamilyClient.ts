import { IDtoParser, BggFamilyDto } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IRequestPaginator } from "../../paginator";
import { IQueryBuilder } from "../../query";
import { IFamilyRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { BGG_API_BASE_URL, FAMILY_QUERY_LIMIT } from "../../constants";
import { PaginationRequestDto, QueryOptions, ProgressResponseDto } from "../dto";
import { IBggFamilyClient } from "../interface";

export class BggFamilyClient implements IBggFamilyClient {
    resource: string;
    builder: IQueryBuilder<IFamilyRequest>;
    fetcher: IFetcher<string, string>;
    responseParser: IResponseParser<string, any>;
    dtoParser: IDtoParser<BggFamilyDto>;
    paginator: IRequestPaginator;
    constructor(
        builder: IQueryBuilder<IFamilyRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<BggFamilyDto>,
        paginator: IRequestPaginator
    ) {
        this.resource = `${BGG_API_BASE_URL}/family`;
        this.builder = builder;
        this.fetcher = fetcher;
        this.responseParser = responseParser;
        this.dtoParser = dtoParser;
        this.paginator = paginator;
    }
    progressHandler?: (progress: ProgressResponseDto<BggFamilyDto>) => void;

    async queryWithProgress(request: IFamilyRequest, progressOptions?: QueryOptions, progressHandler?: (progress: ProgressResponseDto<BggFamilyDto>) => void): Promise<void> {
        const pagination: PaginationRequestDto<IFamilyRequest>[] = this.paginator.paginate<IFamilyRequest>(request, progressOptions?.limit);
        for (const page of pagination) {
            const data: Promise<BggFamilyDto[]> = this.internalQuery(page.request);
            progressHandler?.({
                current: page.current,
                total: page.total,
                data: await data
            });
            this.progressHandler?.({
                current: page.current,
                total: page.total,
                data: await data
            })
        }
    }

    async query(request: IFamilyRequest): Promise<BggFamilyDto[]> {
        try {
            if (Array.isArray(request.id) && (request.id as Array<number>).length > FAMILY_QUERY_LIMIT) {
                const pagination: PaginationRequestDto<IFamilyRequest>[] = this.paginator.paginate(request, FAMILY_QUERY_LIMIT);

                let collection: BggFamilyDto[] = []

                for await (const data of pagination.map(page => this.internalQuery(page.request))) {
                    collection.push(...data);
                }

                return collection;
            }
            return this.internalQuery(request);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError('family', error instanceof Error ? error : undefined);
        }
    }

    private async internalQuery(request: IFamilyRequest): Promise<BggFamilyDto[]> {
        const querystring = this.builder.build(request);
        const xml = await this.fetcher.doFetch(`${this.resource}?${querystring}`);
        const jsonData = await this.responseParser.parseResponse(xml);
        return await this.dtoParser.jsonToDto(jsonData);
    }
}
