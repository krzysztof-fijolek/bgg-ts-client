import { BggApiError, BggParseError, BggClientError } from '../../../src/errors';

describe('BggErrors', () => {
    describe('BggApiError', () => {
        it('should contain status code and url', () => {
            const error = new BggApiError(404, 'https://boardgamegeek.com/xmlapi2/thing?id=999999');
            expect(error.name).toBe('BggApiError');
            expect(error.statusCode).toBe(404);
            expect(error.url).toContain('thing?id=999999');
            expect(error.message).toContain('404');
            expect(error instanceof Error).toBe(true);
        });

        it('should use custom message when provided', () => {
            const error = new BggApiError(500, 'https://example.com', 'Server error');
            expect(error.message).toBe('Server error');
        });
    });

    describe('BggParseError', () => {
        it('should contain error message', () => {
            const error = new BggParseError('Invalid XML');
            expect(error.name).toBe('BggParseError');
            expect(error.message).toBe('Invalid XML');
            expect(error instanceof Error).toBe(true);
        });

        it('should truncate raw data to 500 chars', () => {
            const longData = 'x'.repeat(1000);
            const error = new BggParseError('Parse failed', longData);
            expect(error.rawData!.length).toBe(500);
        });
    });

    describe('BggClientError', () => {
        it('should contain endpoint name', () => {
            const error = new BggClientError('thing');
            expect(error.name).toBe('BggClientError');
            expect(error.endpoint).toBe('thing');
            expect(error instanceof Error).toBe(true);
        });

        it('should wrap cause error', () => {
            const cause = new Error('network failed');
            const error = new BggClientError('collection', cause);
            expect(error.cause).toBe(cause);
            expect(error.message).toContain('network failed');
            expect(error.message).toContain('collection');
        });
    });
});
