import {ContentMessageProxy} from "@extension/message-proxy";
import {PushClient} from "../src/modules/push-client";

declare global {
  interface Document {
    __Content__: {
      MessageProxy: ContentMessageProxy;
      PushClient: PushClient;
      Username: string
    };
  }
}


export {};
