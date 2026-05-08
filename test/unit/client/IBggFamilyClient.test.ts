import { BggFamilyClient, IBggFamilyClient } from '../../../src/client';
import { BggFamilyDtoParser } from '../../../src/dto';
import { BggClientError } from '../../../src/errors';
import { TextFetcher } from '../../../src/fetcher';
import { RequestPaginator } from '../../../src/paginator';
import { GenericQueryBuilder } from '../../../src/query';
import { IFamilyRequest } from '../../../src/request';
import { XmlResponseParser } from '../../../src/responseparser';

jest.mock('../../../src/fetcher');
jest.mock('../../../src/responseparser');
jest.mock('../../../src/dto');

const textFetcherMock = TextFetcher as jest.MockedClass<typeof TextFetcher>;
const xmlResponseParserMock = XmlResponseParser as jest.MockedClass<typeof XmlResponseParser>;
const dtoParserMock = BggFamilyDtoParser as jest.MockedClass<typeof BggFamilyDtoParser>;

beforeEach(() => {
    jest.clearAllMocks();
    textFetcherMock.prototype.doFetch.mockResolvedValue('');
    xmlResponseParserMock.prototype.parseResponse.mockResolvedValue({});
    dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
});

describe('IBggFamilyClient', () => {
    const familyClient: IBggFamilyClient = new BggFamilyClient(
        new GenericQueryBuilder<IFamilyRequest>(),
        textFetcherMock.prototype,
        xmlResponseParserMock.prototype,
        dtoParserMock.prototype,
        new RequestPaginator()
    );

    test('query() should call all dependencies once for a single id', async () => {
        await familyClient.query({ id: 8374 });

        expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
        expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
        expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
    });

    test('query() should hit the family resource URL', async () => {
        await familyClient.query({ id: 8374 });

        const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
        expect(url).toContain('/xmlapi2/family?');
        expect(url).toContain('id=8374');
    });

    test('query() should paginate when id array exceeds FAMILY_QUERY_LIMIT', async () => {
        await familyClient.query({ id: [1, 2, 3] });

        // FAMILY_QUERY_LIMIT is 1, so 3 ids → 3 fetches
        expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(3);
    });

    test('query() should wrap errors in BggClientError with endpoint "family"', async () => {
        textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

        const error = await familyClient.query({ id: 8374 }).catch((e) => e);
        expect(error).toBeInstanceOf(BggClientError);
        expect((error as BggClientError).endpoint).toBe('family');
    });

    test('queryWithProgress() should invoke the function progressHandler once per page', async () => {
        let count = 0;
        await familyClient.queryWithProgress({ id: [1, 2, 3] }, { limit: 1 }, (_p) => {
            count++;
        });
        expect(count).toBe(3);
    });

    test('queryWithProgress() should invoke the instance progressHandler once per page', async () => {
        let count = 0;
        familyClient.progressHandler = (_p) => {
            count++;
        };
        await familyClient.queryWithProgress({ id: [1, 2, 3] }, { limit: 1 });
        expect(count).toBe(3);
        familyClient.progressHandler = undefined;
    });

    test('queryWithProgress() should pass current/total/data shape to handler', async () => {
        const seen: { current: number; total: number; dataLen: number }[] = [];
        await familyClient.queryWithProgress({ id: [1, 2] }, { limit: 1 }, (p) => {
            seen.push({ current: p.current, total: p.total, dataLen: p.data.length });
        });
        expect(seen).toEqual([
            { current: 1, total: 2, dataLen: 0 },
            { current: 2, total: 2, dataLen: 0 },
        ]);
    });

    test('queryWithProgress() should invoke both handlers when both are configured', async () => {
        let paramCount = 0;
        let instanceCount = 0;
        familyClient.progressHandler = (_p) => {
            instanceCount++;
        };
        await familyClient.queryWithProgress({ id: [1, 2] }, { limit: 1 }, (_p) => {
            paramCount++;
        });
        expect(paramCount).toBe(2);
        expect(instanceCount).toBe(2);
        familyClient.progressHandler = undefined;
    });
});
