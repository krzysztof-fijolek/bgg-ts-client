import { BggCollectionDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggCollectionDtoParser extends BaseDtoParser<BggCollectionDto> {
  constructor() {
    super('Collection');
  }

  protected extractData(jsonData: any): any {
    return jsonData.items ?? null;
  }

  protected getDtoClass(): any {
    return BggCollectionDto;
  }
}
