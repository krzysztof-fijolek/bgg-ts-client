import { IFetcher } from '../interface';
import { BggApiError } from '../../errors';
import { RETRY_DELAY_MS, MAX_RETRY_ATTEMPTS } from '../../constants';
import fetch from 'isomorphic-unfetch';

export class TextFetcher implements IFetcher<string, string> {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async doFetch(query: string): Promise<string> {
    let response = await this.internalFetch(query);
    let retries = 0;

    while (response.status === 202 && retries < MAX_RETRY_ATTEMPTS) {
      await this.delay(RETRY_DELAY_MS);
      response = await this.internalFetch(query);
      retries++;
    }

    if (response.status === 202) {
      throw new BggApiError(
        202,
        query,
        `BGG API still processing after ${MAX_RETRY_ATTEMPTS} retries`
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new BggApiError(response.status, query, body || undefined);
    }

    return response.text();
  }

  async internalFetch(query: string): Promise<any> {
    const response = await fetch(query, {
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    });

    return response;
  }

  async delay(waitFor: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, waitFor);
    });
  }
}
