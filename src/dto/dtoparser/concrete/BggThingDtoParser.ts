import { BggThingDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggThingDtoParser extends BaseDtoParser<BggThingDto> {
  constructor() {
    super('Thing');
  }

  protected extractData(jsonData: any): any {
    return jsonData.items?.[0]?.item ?? null;
  }

  protected getDtoClass(): any {
    return BggThingDto;
  }

  protected postProcess(items: BggThingDto[]): BggThingDto[] {
    for (const item of items) {
      if (!item.name && item.alternateNames?.length > 0) {
        item.name = item.alternateNames[0];
      }
    }
    return items;
  }
}
