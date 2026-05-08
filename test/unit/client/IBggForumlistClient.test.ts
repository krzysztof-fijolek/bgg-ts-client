import { BggForumlistClient, IBggForumlistClient } from '../../../src/client';
import { BggForumlistDtoParser } from '../../../src/dto';
import { BggClientError } from '../../../src/errors';
import { TextFetcher } from '../../../src/fetcher';
import { RequestPaginator } from '../../../src/paginator';
import { GenericQueryBuilder } from '../../../src/query';
import { IForumlistRequest } from '../../../src/request';
import { XmlResponseParser } from '../../../src/responseparser';

jest.mock('../../../src/fetcher');
jest.mock('../../../src/responseparser');
jest.mock('../../../src/dto');

const textFetcherMock = TextFetcher as jest.MockedClass<typeof TextFetcher>;
const xmlResponseParserMock = XmlResponseParser as jest.MockedClass<typeof XmlResponseParser>;
const dtoParserMock = BggForumlistDtoParser as jest.MockedClass<typeof BggForumlistDtoParser>;

beforeEach(() => {
    jest.clearAllMocks();
    textFetcherMock.prototype.doFetch.mockResolvedValue('');
    xmlResponseParserMock.prototype.parseResponse.mockResolvedValue({});
    dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
});

describe('IBggForumlistClient', () => {
    const forumlistClient: IBggForumlistClient = new BggForumlistClient(
        new GenericQueryBuilder<IForumlistRequest>(),
        textFetcherMock.prototype,
        xmlResponseParserMock.prototype,
        dtoParserMock.prototype,
        new RequestPaginator()
    );

    test('query() should call all dependencies once for a single id', async () => {
        await forumlistClient.query({ id: 227002, type: 'thing' });

        expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
        expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
        expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
    });

    test('query() should hit the forumlist resource URL', async () => {
        await forumlistClient.query({ id: 227002, type: 'thing' });

        const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
        expect(url).toContain('/xmlapi2/forumlist?');
        expect(url).toContain('id=227002');
        expect(url).toContain('type=thing');
    });

    test('query() should wrap errors in BggClientError with endpoint "forumlist"', async () => {
        xmlResponseParserMock.prototype.parseResponse.mockRejectedValueOnce(new Error('parse fail'));

        const error = await forumlistClient.query({ id: 227002 }).catch((e) => e);
        expect(error).toBeInstanceOf(BggClientError);
        expect((error as BggClientError).endpoint).toBe('forumlist');
    });

    test('queryWithProgress() should report progress for a single page', async () => {
        let lastProgress;
        await forumlistClient.queryWithProgress({ id: 227002 }, { limit: 1 }, (p) => {
            lastProgress = p;
        });
        expect(lastProgress).toMatchObject({
            current: expect.any(Number),
            total: expect.any(Number),
            data: expect.any(Array),
        });
    });

    test('queryWithProgress() should invoke both param and instance handlers', async () => {
        let paramCount = 0;
        let instanceCount = 0;
        forumlistClient.progressHandler = (_p) => {
            instanceCount++;
        };
        await forumlistClient.queryWithProgress({ id: 227002 }, { limit: 1 }, (_p) => {
            paramCount++;
        });
        expect(paramCount).toBe(1);
        expect(instanceCount).toBe(1);
        forumlistClient.progressHandler = undefined;
    });
});
