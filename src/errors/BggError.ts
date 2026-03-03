export class BggApiError extends Error {
  readonly statusCode: number;
  readonly url: string;

  constructor(statusCode: number, url: string, message?: string) {
    super(message || `BGG API request failed with status ${statusCode}: ${url}`);
    this.name = 'BggApiError';
    this.statusCode = statusCode;
    this.url = url;
  }
}

export class BggParseError extends Error {
  readonly rawData?: string;

  constructor(message: string, rawData?: string) {
    super(message);
    this.name = 'BggParseError';
    this.rawData = rawData?.substring(0, 500);
  }
}

export class BggClientError extends Error {
  readonly endpoint: string;
  readonly cause?: Error;

  constructor(endpoint: string, cause?: Error) {
    super(
      `BGG client error for ${endpoint}${cause ? ': ' + cause.message : ''}`
    );
    this.name = 'BggClientError';
    this.endpoint = endpoint;
    this.cause = cause;
  }
}
