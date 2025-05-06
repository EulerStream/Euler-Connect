import {WebSocket} from "ws";
import {IncomingMessage} from "http";
import {RoomManager} from "./room-manager";

const roomManager = new RoomManager();

export function handleConnection(
    ws: WebSocket,
    _: IncomingMessage,
    {sessionId, uniqueId, role}: { sessionId: string; uniqueId: string; role: string }
) {
  const roomKey = `${sessionId}:${uniqueId}`;
  const isPub = role === "pub";

  const added = roomManager.addClient(roomKey, ws, isPub);

  if (!added) {
    ws.close(1008, "Publisher already exists for this room");
    return;
  }

  ws.on("message", (message) => {
    if (isPub) {
      roomManager.broadcastToSubscribers(roomKey, message.toString());
    }
  });

  ws.on("close", () => {
    roomManager.removeClient(roomKey, ws);
  });
}
