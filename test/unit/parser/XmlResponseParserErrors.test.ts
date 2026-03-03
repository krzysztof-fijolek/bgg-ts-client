import { XmlResponseParser } from '../../../src/responseparser/concrete/XmlResponseParser';
import { BggParseError } from '../../../src/errors';

describe('XmlResponseParser error handling', () => {
    const parser = new XmlResponseParser();

    it('should reject with BggParseError on empty string', async () => {
        await expect(parser.parseResponse('')).rejects.toThrow(BggParseError);
    });

    it('should reject with BggParseError on whitespace-only string', async () => {
        await expect(parser.parseResponse('   ')).rejects.toThrow(BggParseError);
    });

    it('should successfully parse valid XML', async () => {
        const xml = '<items><item id="1"><name value="Test"/></item></items>';
        const result = await parser.parseResponse(xml);
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
    });
});
