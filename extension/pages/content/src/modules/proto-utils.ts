import * as tikTokSchema from './tiktok-schema';
import {MessageFns, WebcastResponse, WebcastWebsocketMessage} from './tiktok-schema';
import pako from 'pako';

type ExtractMessageType<T> = T extends MessageFns<infer U> ? U : never;

// Messages
export type WebcastMessage = {
  [K in keyof typeof tikTokSchema as ExtractMessageType<typeof tikTokSchema[K]> extends never ? never : K]:
  ExtractMessageType<typeof tikTokSchema[K]>;
};

// Top-Level Messages
export type WebcastEventMessage = {
  [K in keyof WebcastMessage as K extends `Webcast${string}` ? K : never]: WebcastMessage[K];
};


const webcastEvents: (keyof WebcastMessage)[] = Object.keys(tikTokSchema).filter((message) => message.startsWith('Webcast')) as (keyof WebcastMessage)[];

/**
 * Find the messages defined in the TikTok protobuf schema
 */
async function getTikTokSchemaNames(): Promise<string[]> {
  return Object.keys(tikTokSchema);
}

/**
 * Find the Webcast messages defined in the TikTok protobuf schema
 */
async function getWebcastEvents(): Promise<string[]> {
  return (await getTikTokSchemaNames()).filter((message) => message.startsWith('Webcast'));
}

export type DecodedWebcastWebsocketMessage = WebcastWebsocketMessage & {
  webcastResponse?: WebcastResponse;
}

declare module './tiktok-schema' {
  export interface Message {
    decodedData?: WebcastEventMessage[keyof WebcastEventMessage];
  }
}

/**
 * Decompress gzipped data and return a Uint8Array.
 */
function ungzip(gzippedData: Uint8Array | ArrayBuffer) {
  const input = gzippedData instanceof ArrayBuffer
      ? new Uint8Array(gzippedData)
      : gzippedData;

  return pako.ungzip(input);
}


export function deserializeMessage<T extends keyof WebcastMessage>(
    protoName: T,
    binaryMessage: Uint8Array
): WebcastMessage[T] {

  // @ts-expect-error
  const messageFn: MessageFns<WebcastMessage[T]> | undefined = tikTokSchema[protoName];
  if (!messageFn) throw new Error(`Invalid schema name: ${protoName}`);
  const webcastResponse: WebcastMessage[T] = messageFn.decode(binaryMessage);

  // Handle WebcastResponse nested messages
  if (protoName === 'WebcastResponse') {
    for (const message of (webcastResponse as WebcastResponse).messages || []) {
      if (!webcastEvents.includes(message.type as keyof WebcastMessage)) {
        continue;
      }

      const messageType = message.type as keyof WebcastEventMessage;
      message.decodedData = deserializeMessage(messageType, message.binary);
    }
  }

  return webcastResponse;
}


export async function deserializeWebSocketMessage(binaryMessage: ArrayBuffer): Promise<DecodedWebcastWebsocketMessage> {
  // Websocket messages are in a container which contains additional data
  // Message type 'msg' represents a normal WebcastResponse
  const rawWebcastWebSocketMessage = WebcastWebsocketMessage.decode(new Uint8Array(binaryMessage));
  let webcastResponse: WebcastResponse | undefined = undefined;

  if (rawWebcastWebSocketMessage.type === 'msg') {
    let binary: Uint8Array = rawWebcastWebSocketMessage.binary;

    // Decompress binary (if gzip compressed)
    // https://www.rfc-editor.org/rfc/rfc1950.html
    if (binary && binary.length > 2 && binary[0] === 0x1f && binary[1] === 0x8b && binary[2] === 0x08) {
      rawWebcastWebSocketMessage.binary = ungzip(binary);
    }

    webcastResponse = deserializeMessage('WebcastResponse', rawWebcastWebSocketMessage.binary);
  }

  return {
    ...rawWebcastWebSocketMessage,
    webcastResponse
  };

}
