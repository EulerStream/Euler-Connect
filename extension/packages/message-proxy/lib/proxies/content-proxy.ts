import {
  BaseMessageProxy,
  CallbackData,
  ProxyEventSource,
  ProxyListenerCallback,
  ProxyMessagePacket
} from "../base-proxy";
import {EventEmitter} from "events";
import Logger from "@extension/shared/dist/lib/logger";

/**
 * Receiving Cases:
 *
 * Injected -> Background (Passing through content)
 * Injected -> Content
 *
 * Background -> Injected (Passing through content)
 * Background -> Content
 *
 * Sending Cases:
 *
 * Content -> Injected
 * Content -> Background
 *
 */

export class ContentMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    window.addEventListener("message", this.receiveProxiedMessageFromInjected.bind(this));
    chrome.runtime.onMessage.addListener(this.receiveProxiedMessageFromBackground.bind(this));
  }

  private abstractEmitProxiedMessage(
      from: ProxyEventSource,
      to: ProxyEventSource,
      type: string,
      data: any,
      cb?: ProxyListenerCallback
  ): void {

    const messagePacket: ProxyMessagePacket<any> = {
      from: from,
      to: to,
      type: type,
      data: data,
      id: Math.random().toString(36).substring(7),
      hasCallback: !!cb,
      isCallback: false
    }

    this.abstractEmitProxiedMessagePacket(messagePacket, cb);

  }

  private abstractEmitProxiedMessagePacket(
      messagePacket: ProxyMessagePacket<any>,
      cb?: ProxyListenerCallback,
  ): void {

    if (cb) {
      this.addCallbackListener(messagePacket, cb);
    }

    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        throw new Error("Content cannot emit messages to itself!");
      case ProxyEventSource.BACKGROUND:
        chrome.runtime.sendMessage(messagePacket).catch((e) => console.error("Failed Content -> Background!", e));
        break;
      case ProxyEventSource.INJECTED:
        window.postMessage(messagePacket, "*");
        break;
      default:
        throw new Error(`Unknown event target "${messagePacket.to}"!`);
    }
  }

  emit(event: string, to: ProxyEventSource, data: any, cb?: ProxyListenerCallback, isCb?: boolean): boolean {
    this.abstractEmitProxiedMessage(ProxyEventSource.CONTENT, to, event, data, cb);
    return true;
  }

  receiveProxiedMessageFromInjected(event: MessageEvent) {
    const messagePacket = event.data as ProxyMessagePacket<any>;

    // Only accept messages from the injected script
    if (messagePacket.from != ProxyEventSource.INJECTED) {
      return;
    }

    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket, undefined, messagePacket.hasCallback, messagePacket.isCallback);
        break;
      case ProxyEventSource.BACKGROUND:
        this.abstractEmitProxiedMessagePacket(messagePacket, undefined);
        break;
      default:
        throw new Error(`Unsupported event source "${messagePacket.to}"!`);
    }

  }

  receiveProxiedMessageFromBackground(messagePacket: ProxyMessagePacket<any>) {
    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket, undefined);
        break;
      case ProxyEventSource.INJECTED:
        if (messagePacket.isCallback) {
          let callbackData: CallbackData<any> = messagePacket.data;
          messagePacket = {
            id: callbackData.originalEvent.id,
            type: callbackData.originalEvent.id,
            from: callbackData.originalEvent.to,
            to: callbackData.originalEvent.from,
            data: callbackData.responseData,
            hasCallback: false,
            isCallback: true
          }
          this.abstractEmitProxiedMessagePacket(messagePacket, undefined);
        } else {
          this.abstractEmitProxiedMessagePacket(messagePacket, undefined);
        }

        break;
      default:
        throw new Error(`Unsupported event target \"${messagePacket.to}\"!`);
    }
  }

  onUnmount() {
    window.removeEventListener("message", this.receiveProxiedMessageFromInjected.bind(this));
    chrome.runtime.onMessage.removeListener(this.receiveProxiedMessageFromBackground.bind(this));
  }

}


