import {BaseMessageProxy, ProxyEventSource, ProxyListenerCallback, ProxyMessagePacket} from "../base-proxy";
import {EventEmitter} from "events";
import Logger from "@extension/shared/lib/logger";
import {matchHostnameToPatterns} from "../utilts";

export class BackgroundMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    chrome.runtime.onMessage.addListener(this.receiveProxiedMessage.bind(this));
    Logger.info('Loaded BackgroundMessageProxy');
  }

  emit(type: string, to: ProxyEventSource, data: any, cb?: ProxyListenerCallback, isCb?: boolean): boolean {
    const messagePacket: ProxyMessagePacket<any> = {
      from: ProxyEventSource.BACKGROUND,
      to: to,
      type: type,
      data: data,
      id: Math.random().toString(36).substring(7),
      hasCallback: !!cb,
      isCallback: !!isCb
    }

    if (cb) {
      this.addCallbackListener(messagePacket, cb);
    }

    const allowedHosts = [...chrome.runtime.getManifest().host_permissions, 'chrome-extension://*'];
    // Grab >>ALL<< tabs, i.e. no queryInfo, because when developing with multiple tabs open, queryInfo will only return the active tab
    // And it'll screw us up. On actual prod, there's only 1 window, so this isn't an issue...
    chrome.tabs.query({}, async (tabs) => {
      for (const tab of tabs) {
        if (tab.id && tab.url && matchHostnameToPatterns(new URL(tab.url).hostname, allowedHosts) && !tab.url.includes("chrome://extensions")) {
          await chrome.tabs.sendMessage(tab.id!, messagePacket).catch(console.error);
        }
      }
    });
    return true;
  }

  receiveProxiedMessage(messagePacket: ProxyMessagePacket<any>, sender: chrome.runtime.MessageSender) {

    // Sender MUST be ourself
    if (sender.id !== chrome.runtime.id) {
      return;
    }

    if (messagePacket.to !== ProxyEventSource.BACKGROUND) {
      throw new Error("Background can only receive messages intended for itself!");
    }

    EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
  }

  onUnmount() {
    chrome.runtime.onMessage.removeListener(this.receiveProxiedMessage.bind(this));
  }

}


