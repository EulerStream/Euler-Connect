import {WebSocket} from "ws";

type Client = {
  ws: WebSocket;
  isPub: boolean;
};

export class RoomManager {
  private rooms: Record<string, { pub?: WebSocket; subs: Set<WebSocket> }> = {};

  addClient(roomKey: string, ws: WebSocket, isPub: boolean): boolean {
    if (!this.rooms[roomKey]) {
      this.rooms[roomKey] = {subs: new Set()};
    }

    const room = this.rooms[roomKey];

    if (isPub) {
      if (room.pub) {
        return false; // Cannot add another publisher
      }
      room.pub = ws;
    } else {
      room.subs.add(ws);
    }

    return true;
  }

  hasPublisher(roomKey: string): boolean {
    return !!this.rooms[roomKey]?.pub;
  }

  broadcastToSubscribers(roomKey: string, message: string) {
    const room = this.rooms[roomKey];
    if (!room) return;
    for (const sub of room.subs) {
      if (sub.readyState === WebSocket.OPEN) {
        sub.send(message);
      }
    }
  }

  removeClient(roomKey: string, ws: WebSocket) {
    const room = this.rooms[roomKey];
    if (!room) return;

    if (room.pub === ws) {
      room.pub = undefined;
    }

    room.subs.delete(ws);

    if (!room.pub && room.subs.size === 0) {
      delete this.rooms[roomKey];
    }
  }
}
