import { BggForumDto } from '../../concrete';
import { BaseDtoParser } from './BaseDtoParser';

export class BggForumDtoParser extends BaseDtoParser<BggForumDto> {
  constructor() {
    super('Forum');
  }

  protected extractData(jsonData: any): any {
    return jsonData.forum ?? null;
  }

  protected getDtoClass(): any {
    return BggForumDto;
  }
}
