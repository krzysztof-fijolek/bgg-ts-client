import {
    BggHotClient,
    BggSearchClient,
    BggForumClient,
    BggThreadClient,
    BggUserClient,
    BggGuildClient,
    BggPlayClient,
    BggCollectionClient,
} from '../../../src/client';
import {
    BggHotDto,
    BggHotDtoParser,
    BggSearchDto,
    BggSearchDtoParser,
    BggForumDto,
    BggForumDtoParser,
    BggThreadDto,
    BggThreadDtoParser,
    BggUserDto,
    BggUserDtoParser,
    BggGuildDto,
    BggGuildDtoParser,
    BggPlayDto,
    BggPlayDtoParser,
    BggCollectionDto,
    BggCollectionDtoParser,
} from '../../../src/dto';
import { BggClientError } from '../../../src/errors';
import { TextFetcher } from '../../../src/fetcher';
import { GenericQueryBuilder } from '../../../src/query';
import {
    IHotItemsRequest,
    ISearchRequest,
    IForumRequest,
    IThreadRequest,
    IUserRequest,
    IGuildRequest,
    IPlaysRequest,
    ICollectionRequest,
} from '../../../src/request';
import { XmlResponseParser } from '../../../src/responseparser';
import { TextResponseByEndpoint } from '../utils';

jest.mock('../../../src/fetcher');
jest.mock('../../../src/responseparser');
jest.mock('../../../src/dto');

const textFetcherMock = TextFetcher as jest.MockedClass<typeof TextFetcher>;
const xmlResponseParserMock = XmlResponseParser as jest.MockedClass<typeof XmlResponseParser>;

beforeEach(() => {
    jest.clearAllMocks();
    textFetcherMock.prototype.doFetch.mockImplementation((query) => {
        return new Promise((resolve) => {
            resolve(TextResponseByEndpoint[query] ?? '');
        });
    });
    xmlResponseParserMock.prototype.parseResponse.mockResolvedValue({});
});

describe('BggClients', () => {
    describe('IBggSearchClient', () => {
        const dtoParserMock = BggSearchDtoParser as jest.MockedClass<typeof BggSearchDtoParser>;
        const searchClient = new BggSearchClient(
            new GenericQueryBuilder<ISearchRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggSearchDto[] = await searchClient.query({ query: 'Gloom' });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the search resource URL and query string', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await searchClient.query({ query: 'Gloom' });

            const calledWith = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(calledWith).toContain('/xmlapi2/search?');
            expect(calledWith).toContain('query=Gloom');
        });

        test('should wrap fetcher errors in BggClientError with endpoint "search"', async () => {
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

            await expect(searchClient.query({ query: 'Gloom' })).rejects.toBeInstanceOf(BggClientError);
            try {
                await searchClient.query({ query: 'Gloom' });
            } catch (e) {
                expect((e as BggClientError).endpoint).toBe('search');
            }
        });
    });

    describe('IBggHotClient', () => {
        const dtoParserMock = BggHotDtoParser as jest.MockedClass<typeof BggHotDtoParser>;
        const hotClient = new BggHotClient(
            new GenericQueryBuilder<IHotItemsRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggHotDto[] = await hotClient.query({ type: 'boardgame' });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the hot resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await hotClient.query({ type: 'boardgame' });

            expect(textFetcherMock.prototype.doFetch.mock.calls[0][0]).toContain('/xmlapi2/hot?');
        });

        test('should wrap parser errors in BggClientError with endpoint "hot"', async () => {
            xmlResponseParserMock.prototype.parseResponse.mockRejectedValueOnce(new Error('parse fail'));

            await expect(hotClient.query({ type: 'boardgame' })).rejects.toBeInstanceOf(BggClientError);
        });
    });

    describe('IBggForumClient', () => {
        const dtoParserMock = BggForumDtoParser as jest.MockedClass<typeof BggForumDtoParser>;
        const forumClient = new BggForumClient(
            new GenericQueryBuilder<IForumRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggForumDto[] = await forumClient.query({ id: 19 });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the forum resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await forumClient.query({ id: 19 });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/forum?');
            expect(url).toContain('id=19');
        });

        test('should wrap fetcher errors in BggClientError with endpoint "forum"', async () => {
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

            await expect(forumClient.query({ id: 19 })).rejects.toMatchObject({
                endpoint: 'forum',
            });
        });
    });

    describe('IBggThreadClient', () => {
        const dtoParserMock = BggThreadDtoParser as jest.MockedClass<typeof BggThreadDtoParser>;
        const threadClient = new BggThreadClient(
            new GenericQueryBuilder<IThreadRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggThreadDto[] = await threadClient.query({ id: 1082079 });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the thread resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await threadClient.query({ id: 1082079 });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/thread?');
            expect(url).toContain('id=1082079');
        });

        test('should wrap fetcher errors in BggClientError with endpoint "thread"', async () => {
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

            await expect(threadClient.query({ id: 1 })).rejects.toMatchObject({
                endpoint: 'thread',
            });
        });
    });

    describe('IBggUserClient', () => {
        const dtoParserMock = BggUserDtoParser as jest.MockedClass<typeof BggUserDtoParser>;
        const userClient = new BggUserClient(
            new GenericQueryBuilder<IUserRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggUserDto[] = await userClient.query({ name: 'mattiabanned' });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the user resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await userClient.query({ name: 'mattiabanned' });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/user?');
            expect(url).toContain('name=mattiabanned');
        });

        test('should wrap fetcher errors in BggClientError with endpoint "user"', async () => {
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

            await expect(userClient.query({ name: 'foo' })).rejects.toMatchObject({
                endpoint: 'user',
            });
        });
    });

    describe('IBggGuildClient', () => {
        const dtoParserMock = BggGuildDtoParser as jest.MockedClass<typeof BggGuildDtoParser>;
        const guildClient = new BggGuildClient(
            new GenericQueryBuilder<IGuildRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggGuildDto[] = await guildClient.query({ id: 1303, members: 1 });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the guild resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await guildClient.query({ id: 1303, members: 1 });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/guild?');
            expect(url).toContain('id=1303');
            expect(url).toContain('members=1');
        });

        test('should wrap dto-parser errors in BggClientError with endpoint "guild"', async () => {
            dtoParserMock.prototype.jsonToDto.mockRejectedValueOnce(new Error('dto fail'));

            await expect(guildClient.query({ id: 1 })).rejects.toMatchObject({
                endpoint: 'guild',
            });
        });
    });

    describe('IBggPlaysClient', () => {
        const dtoParserMock = BggPlayDtoParser as jest.MockedClass<typeof BggPlayDtoParser>;
        const playClient = new BggPlayClient(
            new GenericQueryBuilder<IPlaysRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggPlayDto[] = await playClient.query({ username: 'mattiabanned' });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the plays resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await playClient.query({ username: 'mattiabanned' });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/plays?');
            expect(url).toContain('username=mattiabanned');
        });

        test('should wrap fetcher errors in BggClientError with endpoint "plays"', async () => {
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(new Error('boom'));

            await expect(playClient.query({ username: 'foo' })).rejects.toMatchObject({
                endpoint: 'plays',
            });
        });
    });

    describe('IBggCollectionClient', () => {
        const dtoParserMock = BggCollectionDtoParser as jest.MockedClass<typeof BggCollectionDtoParser>;
        const collectionClient = new BggCollectionClient(
            new GenericQueryBuilder<ICollectionRequest>(),
            textFetcherMock.prototype,
            xmlResponseParserMock.prototype,
            dtoParserMock.prototype
        );

        test('should call dependency one times each', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            const data: BggCollectionDto[] = await collectionClient.query({ username: 'mattiabanned' });

            expect(textFetcherMock.prototype.doFetch).toHaveBeenCalledTimes(1);
            expect(xmlResponseParserMock.prototype.parseResponse).toHaveBeenCalledTimes(1);
            expect(dtoParserMock.prototype.jsonToDto).toHaveBeenCalledTimes(1);
            expect(Array.isArray(data)).toBe(true);
        });

        test('should call fetcher with the collection resource URL', async () => {
            dtoParserMock.prototype.jsonToDto.mockResolvedValue([]);
            await collectionClient.query({ username: 'mattiabanned' });

            const url = textFetcherMock.prototype.doFetch.mock.calls[0][0];
            expect(url).toContain('/xmlapi2/collection?');
            expect(url).toContain('username=mattiabanned');
        });

        test('should re-throw an existing BggClientError without re-wrapping', async () => {
            const originalError = new BggClientError('upstream', new Error('cause'));
            textFetcherMock.prototype.doFetch.mockRejectedValueOnce(originalError);

            await expect(collectionClient.query({ username: 'foo' })).rejects.toBe(originalError);
        });
    });
});
