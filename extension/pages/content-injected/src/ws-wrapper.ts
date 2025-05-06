import {ProxyEvent} from "@extension/message-proxy";
import {ProxyEventSource} from "@extension/message-proxy/lib/base-proxy";
import Logger from "@extension/shared/lib/logger";

type WebSocketConstructor = typeof WebSocket;


/**
 * Whenever a message is received from the TikTok LIVE WebSocket connection, emit it to the content script.
 * @param event The message event from the WebSocket.
 */
function pushMessage(event: MessageEvent) {

  document.__Agent__.MessageProxy.emit(
      ProxyEvent.WEBSOCKET_MESSAGE,
      ProxyEventSource.CONTENT,
      {binary: event.data}
  );
}

/**
 * Wrapper that pushes WebSocket messages to content script
 */
class WebSocketWrapper {
  private static OriginalWebSocket: WebSocketConstructor = window.WebSocket;

  constructor(url: string | URL, protocols?: string | string[]) {
    const ws = new WebSocketWrapper.OriginalWebSocket(url, protocols);

    // If it's the TikTok LIVE WebSocket connection, intercept.
    // There is only ever one of these per page.
    const isLiveWs = (typeof url === 'string' && url.includes('/webcast/im')) || (url instanceof URL && url.pathname.includes('/webcast/im'));

    if (isLiveWs) {
      Logger.info(`Intercepted a WebSocket: {1}`, url)

      ws.addEventListener('open', () => {
        document.__Agent__.Connection = ws;
      });

      const cleanup = () => {
        if (document.__Agent__.Connection === ws) {
          document.__Agent__.Connection = null;
        }
      };

      ws.addEventListener('close', cleanup);
      ws.addEventListener('error', cleanup);
      ws.addEventListener('message', pushMessage);
    }

    return ws;
  }

}

window.WebSocket = WebSocketWrapper as unknown as WebSocketConstructor;

export default WebSocketWrapper;
