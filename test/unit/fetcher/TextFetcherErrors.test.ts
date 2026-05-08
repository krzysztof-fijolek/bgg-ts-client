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
        // Skip real waiting between retries.
        jest.spyOn(fetcher, 'delay').mockResolvedValue(undefined);
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

    it('should throw BggApiError after exhausting retries on persistent 429', async () => {
        const url = 'https://example.com/api?id=1';
        mockedFetch.mockResolvedValue({
            status: 429,
            ok: false,
            headers: { get: () => null },
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
        // Initial attempt + MAX_RETRY_ATTEMPTS (5) retries.
        expect(mockedFetch).toHaveBeenCalledTimes(6);
    });

    it('should retry on 429 then succeed', async () => {
        mockedFetch
            .mockResolvedValueOnce({
                status: 429,
                ok: false,
                headers: { get: () => null },
                text: () => Promise.resolve('Too Many Requests'),
            } as any)
            .mockResolvedValueOnce({
                status: 200,
                ok: true,
                text: () => Promise.resolve('<items>data</items>'),
            } as any);

        const result = await fetcher.doFetch('https://example.com/api?id=1');
        expect(result).toBe('<items>data</items>');
        expect(mockedFetch).toHaveBeenCalledTimes(2);
    });

    it('should retry on 503 then succeed', async () => {
        mockedFetch
            .mockResolvedValueOnce({
                status: 503,
                ok: false,
                headers: { get: () => null },
                text: () => Promise.resolve('Service Unavailable'),
            } as any)
            .mockResolvedValueOnce({
                status: 200,
                ok: true,
                text: () => Promise.resolve('<items>data</items>'),
            } as any);

        const result = await fetcher.doFetch('https://example.com/api?id=1');
        expect(result).toBe('<items>data</items>');
        expect(mockedFetch).toHaveBeenCalledTimes(2);
    });

    it('should honor Retry-After header (in seconds) when retrying', async () => {
        mockedFetch
            .mockResolvedValueOnce({
                status: 429,
                ok: false,
                headers: { get: (name: string) => (name === 'Retry-After' ? '3' : null) },
                text: () => Promise.resolve('Too Many Requests'),
            } as any)
            .mockResolvedValueOnce({
                status: 200,
                ok: true,
                text: () => Promise.resolve('<items>data</items>'),
            } as any);

        await fetcher.doFetch('https://example.com/api?id=1');

        expect((fetcher.delay as jest.Mock).mock.calls[0][0]).toBe(3000);
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
