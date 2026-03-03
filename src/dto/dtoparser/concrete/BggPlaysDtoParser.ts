import { BggPlayDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggPlayDtoParser extends BaseDtoParser<BggPlayDto> {
  constructor() {
    super('Play');
  }

  protected extractData(jsonData: any): any {
    return jsonData.plays ?? null;
  }

  protected getDtoClass(): any {
    return BggPlayDto;
  }
}
