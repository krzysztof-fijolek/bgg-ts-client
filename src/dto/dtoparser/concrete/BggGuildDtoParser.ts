import { BggGuildDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggGuildDtoParser extends BaseDtoParser<BggGuildDto> {
  constructor() {
    super('Guild');
  }

  protected extractData(jsonData: any): any {
    return jsonData.guild ?? null;
  }

  protected getDtoClass(): any {
    return BggGuildDto;
  }
}
