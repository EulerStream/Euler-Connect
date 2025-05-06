import {EventEmitter} from "events";

export enum ProxyEventSource {
  CONTENT = "CONTENT",
  BACKGROUND = "BACKGROUND",
  INJECTED = "INJECTED"
}

export type ProxyMessagePacket<T> = {
  from: ProxyEventSource;
  to: ProxyEventSource;
  type: string;
  data: T;
  id: string;
  hasCallback: boolean;
  isCallback: boolean;
}

export class MessageProxyTimeoutError extends Error {
  constructor(...args: any[]) {
    super(...args);
    this.name = "MessageProxyTimeoutError";
  }
}

export type ProxyListener = (event: ProxyMessagePacket<any>, respond?: (response?: any) => void) => void;
export type ProxyListenerCallback = (event: any) => void;

export abstract class BaseMessageProxy extends EventEmitter {

  public abstract onUnmount(): void;

  abstract emit(type: string, to: ProxyEventSource, data: any): boolean
  abstract emit(type: string, to: ProxyEventSource, data: any, cb: ProxyListenerCallback): boolean
  abstract emit(type: string, to: ProxyEventSource, data: any, cb?: ProxyListenerCallback, isCb?: boolean): boolean;

  async emitAndWait<T>(type: string, to: ProxyEventSource, data: any, timeout: number = 60_000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.emit(type, to, data, (response: CallbackData<any>) => {
        resolve(response.responseData);
      });
      setTimeout(() => reject(new MessageProxyTimeoutError("Timeout waiting for response!")), timeout);
    });
  }

  on(type: string, listener: ProxyListener): this {
    return super.on(type, (event: ProxyMessagePacket<any>) => {
      listener(event, this.getResponseFn(event));
    });
  }

  protected addCallbackListener(originalEvent: ProxyMessagePacket<any>, cb: ProxyListenerCallback): void {
    this.once(originalEvent.id, (event) => {
      cb(event.data);
    });
  }

  protected getResponseFn(originalEvent: ProxyMessagePacket<any>): ((response: any) => void) | undefined {
    if (!originalEvent.hasCallback) {
      return undefined;
    }

    return (data: any) => this.emitCallback(originalEvent, data);

  }

  protected emitCallback(originalEvent: ProxyMessagePacket<any>, data: any): void {
    this.emit(
        originalEvent.id, // The event is the requestId
        originalEvent.from, // Return to sender
        {
          originalEvent: originalEvent,
          responseData: data
        },
        undefined,
        true
    );
  }

}

export type CallbackData<T> = {
  originalEvent: ProxyMessagePacket<T>,
  responseData: any
}
