import {IncomingMessage} from "http";
import {WebSocketServer} from "ws";
import {URL} from "url";
import internal from "node:stream";

export function handleUpgrade(
    request: IncomingMessage,
    socket: internal.Duplex,
    head: Buffer,
    wss: WebSocketServer
) {
  try {
    const url = new URL(request.url!, "http://localhost");
    const sessionId = url.searchParams.get("sessionId");
    const uniqueId = url.searchParams.get("uniqueId");
    const role = url.searchParams.get("role");

    if (!sessionId || !uniqueId || !role || !["pub", "sub"].includes(role)) {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, { sessionId, uniqueId, role });
    });

  } catch (err) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
  }
}
