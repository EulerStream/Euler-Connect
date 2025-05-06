export const TokenParameters: string[] = [
  "X-Bogus",
  "X-Argus",
  "X-Khronos",
  "msToken",
  "X-Gnarly"
];

export enum OperatorRequestType {
  PROXY_SIGN = "PROXY_SIGN",
  PROXY_FETCH = "PROXY_FETCH",
}

export interface OperatorRequestDetails {
  userAgent: string;
  sessionId?: string;
}

export interface OperatorRequest<T extends OperatorRequestDetails> {
  type: OperatorRequestType,
  requestId: string,
  details: T
}

export interface OperatorResponse<T> {
  requestId: string,
  details: T
  error?: string
  status: number
}


export type ProxyFetchParams = OperatorRequestDetails & {
  room_id: string;
  cursor?: string;
}


export type ProxySignParams = OperatorRequestDetails & {
  method: "GET" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "PATCH" | "HEAD";
  url: string;
  body?: string;
  type: "fetch" | "xhr"
}


export type ProxyFetchResult = Partial<
    {
      webcastResponse: string;
      xhrStatus: number;
      cookies: chrome.cookies.Cookie[];
    }
>;

export type ProxySignResult = Partial<
    {
      signedUrl: string;
      userAgent: string;
      browserName: string;
      browserVersion: string;
      tokens: Record<string, string>;
      requestHeaders: Record<string, string>;
    }
>;

export type ProxyFetchOperatorRequest = OperatorRequest<ProxyFetchParams>
export type ProxyFetchOperatorResponse = OperatorResponse<ProxyFetchResult>

export type ProxySignOperatorRequest = OperatorRequest<ProxySignParams>
export type ProxySignOperatorResponse = OperatorResponse<ProxySignResult>
