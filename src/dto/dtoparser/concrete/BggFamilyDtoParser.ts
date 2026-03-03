import { BggFamilyDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggFamilyDtoParser extends BaseDtoParser<BggFamilyDto> {
  constructor() {
    super('Family');
  }

  protected extractData(jsonData: any): any {
    return jsonData.items?.[0]?.item ?? null;
  }

  protected getDtoClass(): any {
    return BggFamilyDto;
  }
}
