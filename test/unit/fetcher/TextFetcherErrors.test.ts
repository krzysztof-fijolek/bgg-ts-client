import { TextFetcher } from '../../../src/fetcher/concrete/TextFetcher';
import { BggApiError } from '../../../src/errors';

// Mock isomorphic-unfetch
jest.mock('isomorphic-unfetch');
import fetch from 'isomorphic-unfetch';
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('TextFetcher error handling', () => {
    let fetcher: TextFetcher;

    beforeEach(() => {
        fetcher = new TextFetcher('TEST_KEY');
        jest.clearAllMocks();
    });

    it('should throw BggApiError on 404 response', async () => {
        mockedFetch.mockResolvedValue({
            status: 404,
            ok: false,
            text: () => Promise.resolve('Not Found'),
        } as any);

        await expect(fetcher.doFetch('https://example.com/api?id=999'))
            .rejects.toThrow(BggApiError);
    });

    it('should throw BggApiError on 500 response', async () => {
        mockedFetch.mockResolvedValue({
            status: 500,
            ok: false,
            text: () => Promise.resolve('Internal Server Error'),
        } as any);

        await expect(fetcher.doFetch('https://example.com/api?id=1'))
            .rejects.toThrow(BggApiError);
    });

    it('should throw BggApiError with status code and url', async () => {
        const url = 'https://example.com/api?id=1';
        mockedFetch.mockResolvedValue({
            status: 429,
            ok: false,
            text: () => Promise.resolve('Too Many Requests'),
        } as any);

        try {
            await fetcher.doFetch(url);
            fail('Expected BggApiError');
        } catch (error) {
            expect(error).toBeInstanceOf(BggApiError);
            expect((error as BggApiError).statusCode).toBe(429);
            expect((error as BggApiError).url).toBe(url);
        }
    });

    it('should return text on 200 response', async () => {
        mockedFetch.mockResolvedValue({
            status: 200,
            ok: true,
            text: () => Promise.resolve('<items>data</items>'),
        } as any);

        const result = await fetcher.doFetch('https://example.com/api?id=1');
        expect(result).toBe('<items>data</items>');
    });
});
