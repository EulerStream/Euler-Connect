import {InjectedMessageProxy} from "@extension/message-proxy/lib";

declare global {
  interface Document {
    __Agent__: {
      MessageProxy: InjectedMessageProxy;
      Connection: WebSocket | null;
    };
  }
}


export {};
