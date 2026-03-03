import { BggSearchDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggSearchDtoParser extends BaseDtoParser<BggSearchDto> {
  constructor() {
    super('Search');
  }

  protected extractData(jsonData: any): any {
    return jsonData.items ?? null;
  }

  protected getDtoClass(): any {
    return BggSearchDto;
  }
}
