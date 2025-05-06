import {BaseMessageProxy, ProxyEventSource, ProxyListenerCallback, ProxyMessagePacket} from "../base-proxy";
import {EventEmitter} from "events";

export class InjectedMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    window.addEventListener("message", this.receiveProxiedMessage.bind(this));
  }

  /** Injected -> Content -> ? */
  emit(type: string, to: ProxyEventSource, data: any, cb?: ProxyListenerCallback, isCb?: boolean): boolean {
    const messagePacket: ProxyMessagePacket<any> = {
      from: ProxyEventSource.INJECTED,
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

    if (to === ProxyEventSource.INJECTED) {
      throw new Error("InjectedMessageProxy cannot emit messages to itself!")
    }

    window.postMessage(messagePacket, "*");
    return true;
  }

  /** Injected <- Content <- ? */
  receiveProxiedMessage(event: MessageEvent) {

    if (event.source !== window) {
      return;
    }

    const messagePacket = event.data as ProxyMessagePacket<any>;
    EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
  }

  onUnmount() {
    window.removeEventListener("message", this.receiveProxiedMessage.bind(this));
  }

}


