import { BggForumlistDto } from '../../concrete/BggForumlistDto';
import { BaseDtoParser } from './BaseDtoParser';

export class BggForumlistDtoParser extends BaseDtoParser<BggForumlistDto> {
  constructor() {
    super('Forumlist');
  }

  protected extractData(jsonData: any): any {
    return jsonData.forums ?? null;
  }

  protected getDtoClass(): any {
    return BggForumlistDto;
  }
}
