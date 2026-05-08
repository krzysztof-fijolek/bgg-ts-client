import { BggClient } from '../../../src/master';

describe('BggClient', () => {
    it('should be composed by all clients', async () => {

        const instance = BggClient.Create({ apiKey: 'DUMMY_KEY' });

        const clients = ['thing', 'family', 'forumlist', 'forum', 'thread', 'user', 'guild', 'play', 'collection', 'search', 'hot'];

        for (const [key, value] of Object.entries(instance)) {
            expect(clients.includes(key)).toBe(true);
        }
    });

    describe('Create() apiKey validation', () => {
        const expectedMessage = /apiKey is required/;

        it('throws when apiKey is missing', () => {
            expect(() => BggClient.Create({} as any)).toThrow(expectedMessage);
        });

        it('throws when apiKey is an empty string', () => {
            expect(() => BggClient.Create({ apiKey: '' })).toThrow(expectedMessage);
        });

        it('throws when apiKey is whitespace only', () => {
            expect(() => BggClient.Create({ apiKey: '   ' })).toThrow(expectedMessage);
        });

        it('throws when apiKey is not a string', () => {
            expect(() => BggClient.Create({ apiKey: 123 as any })).toThrow(expectedMessage);
        });

        it('throws when options is undefined', () => {
            expect(() => BggClient.Create(undefined as any)).toThrow(expectedMessage);
        });
    });
});