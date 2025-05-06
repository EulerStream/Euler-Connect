import {BackgroundMessageProxy} from "@extension/message-proxy/lib";

declare global {
  interface Document {
    __Background__: {
      MessageProxy: BackgroundMessageProxy,
    }
  }
}

export {};
