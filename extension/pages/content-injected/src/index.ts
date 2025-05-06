import {InjectedMessageProxy} from "@extension/message-proxy/lib";
import Logger from "@extension/shared/lib/logger";
import './ws-wrapper';

document.__Agent__ = {
  MessageProxy: new InjectedMessageProxy(),
  Connection: null,
};

// Make the username available on the document object.
Logger.info("Injected script initialized!");