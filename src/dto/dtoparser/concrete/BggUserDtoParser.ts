import { BggUserDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggUserDtoParser extends BaseDtoParser<BggUserDto> {
  constructor() {
    super('User');
  }

  protected extractData(jsonData: any): any {
    return jsonData.user ?? null;
  }

  protected getDtoClass(): any {
    return BggUserDto;
  }
}
