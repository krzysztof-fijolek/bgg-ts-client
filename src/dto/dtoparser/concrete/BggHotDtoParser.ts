import { BggHotDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggHotDtoParser extends BaseDtoParser<BggHotDto> {
  constructor() {
    super('Hot');
  }

  protected extractData(jsonData: any): any {
    return jsonData.items?.[0]?.item ?? null;
  }

  protected getDtoClass(): any {
    return BggHotDto;
  }
}
