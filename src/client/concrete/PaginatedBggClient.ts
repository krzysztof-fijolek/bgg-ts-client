import { IBggDto, IDtoParser } from "../../dto";
import { BggClientError } from "../../errors";
import { IFetcher } from "../../fetcher";
import { IRequestPaginator } from "../../paginator";
import { IQueryBuilder } from "../../query";
import { IRequest } from "../../request";
import { IResponseParser } from "../../responseparser";
import { ProgressResponseDto, QueryOptions } from "../dto";
import { BaseBggClient } from "./BaseBggClient";

export abstract class PaginatedBggClient<TRequest extends IRequest, TDto extends IBggDto>
    extends BaseBggClient<TRequest, TDto> {

    readonly paginator: IRequestPaginator;
    protected readonly queryLimit: number;
    progressHandler?: (progress: ProgressResponseDto<TDto>) => void;

    constructor(
        endpointName: string,
        queryLimit: number,
        builder: IQueryBuilder<TRequest>,
        fetcher: IFetcher<string, string>,
        responseParser: IResponseParser<string, any>,
        dtoParser: IDtoParser<TDto>,
        paginator: IRequestPaginator
    ) {
        super(endpointName, builder, fetcher, responseParser, dtoParser);
        this.queryLimit = queryLimit;
        this.paginator = paginator;
    }

    async query(request: TRequest): Promise<TDto[]> {
        try {
            if (Array.isArray(request.id) && request.id.length > this.queryLimit) {
                const pages = this.paginator.paginate<TRequest>(request, this.queryLimit);
                const collection: TDto[] = [];
                // Pages are fetched sequentially on purpose: BGG rate-limits aggressively
                // (HTTP 429/503) and a single user-facing query that fans out N pages in
                // parallel will reliably trip the limit. The fetcher retries on 429/503,
                // but serializing here keeps the per-call burst small in the first place.
                for (const page of pages) {
                    const data = await this.internalQuery(page.request);
                    collection.push(...data);
                }
                return collection;
            }
            return await this.internalQuery(request);
        } catch (error) {
            if (error instanceof BggClientError) throw error;
            throw new BggClientError(this.endpointName, error instanceof Error ? error : undefined);
        }
    }

    async queryWithProgress(
        request: TRequest,
        progressOptions?: QueryOptions,
        progressHandler?: (progress: ProgressResponseDto<TDto>) => void
    ): Promise<void> {
        const pages = this.paginator.paginate<TRequest>(request, progressOptions?.limit);
        for (const page of pages) {
            const data = await this.internalQuery(page.request);
            const progress: ProgressResponseDto<TDto> = {
                current: page.current,
                total: page.total,
                data,
            };
            progressHandler?.(progress);
            this.progressHandler?.(progress);
        }
    }
}
