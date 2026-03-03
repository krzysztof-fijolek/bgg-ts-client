import { BggThingDtoParser } from '../../../src/dto/dtoparser/concrete/BggThingDtoParser';
import { BggSearchDtoParser } from '../../../src/dto/dtoparser/concrete/BggSearchDtoParser';

describe('BaseDtoParser error handling', () => {
    it('should return empty array when data path is null', async () => {
        const parser = new BggThingDtoParser();
        const result = await parser.jsonToDto({ items: null });
        expect(result).toEqual([]);
    });

    it('should return empty array when data path is undefined', async () => {
        const parser = new BggThingDtoParser();
        const result = await parser.jsonToDto({});
        expect(result).toEqual([]);
    });

    it('should return empty array when nested path is missing', async () => {
        const parser = new BggThingDtoParser();
        const result = await parser.jsonToDto({ items: [{}] });
        expect(result).toEqual([]);
    });

    it('should return empty array for search parser with null items', async () => {
        const parser = new BggSearchDtoParser();
        const result = await parser.jsonToDto({ items: null });
        expect(result).toEqual([]);
    });
});
