import {ConnectState, ProxyEvent} from "@extension/message-proxy";
import {ProxyEventSource, ProxyMessagePacket} from "@extension/message-proxy/lib/base-proxy";
import {deserializeWebSocketMessage} from "@src/modules/proto-utils";
import {settingStorage} from "@extension/storage/lib";

export class PushClient {
  private started: boolean = false;
  private ws: WebSocket | null = null;

  public async start() {
    if (this.started) return;
    this.started = true;
    document.__Content__.MessageProxy.on(ProxyEvent.WEBSOCKET_MESSAGE, this.onProxyMessage.bind(this));
    await this.connect();
  }

  private async getSessionId(): Promise<string> {
    const {sessionId} = await settingStorage.get();

    if (!sessionId) {
      await settingStorage.resetSessionId();
      return this.getSessionId();
    }

    const url = new URL(window.location.href);
    url.searchParams.set("sessionId", sessionId);
    window.history.replaceState({}, '', url.toString());
    return sessionId;
  }

  private async getWsUrl(): Promise<string> {
    const {customServerUrl, customServerEnabled} = await settingStorage.get();

    if (customServerEnabled && customServerUrl) {
      return customServerUrl;
    }

    return import.meta.env.VITE_PUBLIC_PUSH_SERVER_URL;
  }

  public async connect() {
    const baseUrl = new URL(await this.getWsUrl());
    const sessionId = await this.getSessionId();

    baseUrl.searchParams.set("sessionId", sessionId);
    baseUrl.searchParams.set("role", "pub");
    baseUrl.searchParams.set("uniqueId", document.__Content__.Username);
    const ws = this.ws = new WebSocket(baseUrl.toString());
    ws.onclose = this.onDisconnect.bind(this);
    ws.onopen = this.onOpen.bind(this);
  }

  onOpen() {
    document.__Content__.MessageProxy.emit(ProxyEvent.CONNECT_STATE, ProxyEventSource.BACKGROUND, ConnectState.CONNECTED);
  }

  private onDisconnect() {
    document.__Content__.MessageProxy.emit(ProxyEvent.CONNECT_STATE, ProxyEventSource.BACKGROUND, ConnectState.CONNECTING);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    this.ws = null;
    setTimeout(() => this.connect(), 1000);
  }

  async onProxyMessage(event: ProxyMessagePacket<{ binary: ArrayBuffer }>) {
    const decodedEvent = await deserializeWebSocketMessage(event.data.binary);
    for (let message of decodedEvent.webcastResponse?.messages || []) {

      if (this.ws?.readyState !== WebSocket.OPEN) {
        return;
      }

      this.ws?.send(
          JSON.stringify(
              {
                type: message.type,
                data: message.decodedData,
              }
          )
      )
    }
  }
}