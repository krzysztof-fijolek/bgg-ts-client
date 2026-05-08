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

    // 202 = collection endpoint queued, retry later.
    // 429/503 = rate-limited or overloaded; honor Retry-After if BGG sent one.
    while (this.isRetryable(response.status) && retries < MAX_RETRY_ATTEMPTS) {
      await this.delay(this.retryDelayFor(response));
      response = await this.internalFetch(query);
      retries++;
    }

    if (this.isRetryable(response.status)) {
      throw new BggApiError(
        response.status,
        query,
        response.status === 202
          ? `BGG API still processing after ${MAX_RETRY_ATTEMPTS} retries`
          : `BGG API rate-limited (status ${response.status}) after ${MAX_RETRY_ATTEMPTS} retries`
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new BggApiError(response.status, query, body || undefined);
    }

    return response.text();
  }

  isRetryable(status: number): boolean {
    return status === 202 || status === 429 || status === 503;
  }

  retryDelayFor(response: any): number {
    const header = response?.headers?.get?.('Retry-After');
    if (header) {
      const seconds = Number(header);
      if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
    }
    return RETRY_DELAY_MS;
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
