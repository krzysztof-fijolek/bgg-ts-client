import { BggThreadDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggThreadDtoParser extends BaseDtoParser<BggThreadDto> {
  constructor() {
    super('Thread');
  }

  protected extractData(jsonData: any): any {
    return jsonData.thread ?? null;
  }

  protected getDtoClass(): any {
    return BggThreadDto;
  }
}
