import { useEffect, useRef, useState } from "react";
import type { DataConnection, PeerJSOption } from "peerjs";
import Peer from "peerjs";

export type PeerReceiverHookData = {
  connected: boolean;
  connections: Record<string, DataConnection>;
  peerId: string | null;
  error: string | null;
};

export function useWidgetConnections(
  agentId: string | null,
  options?: PeerJSOption,
): PeerReceiverHookData {
  const peerRef = useRef<Peer | null>(null);
  const [connections, setConnections] = useState<
    Record<string, DataConnection>
  >({});
  const [connected, setConnected] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setError("Agent ID is required");
      return;
    }

    console.log("secure", import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER_SECURE);
    const peer = new Peer(agentId, {
      ...options,
      host: import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER,
      secure: import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER_SECURE === "true",
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      setError(null);
    });

    peer.on("connection", (conn) => {
      setConnections((prev) => ({
        ...prev,
        [conn.peer]: conn,
      }));

      conn.on("open", () => {
        setConnected(true);
      });

      conn.on("close", () => {
        setConnections((prev) => {
          const { [conn.peer]: _, ...rest } = prev;
          setConnected(Object.values(rest).some((c) => c.open));
          return rest;
        });
      });

      conn.on("error", (err) => {
        setError(err.message);
      });
    });

    peer.on("error", (err) => {
      setError(err.message);
    });

    return () => {
      Object.values(connections).forEach((conn) => conn.close());
      peer.destroy();
    };
  }, []);

  return {
    connected,
    connections,
    peerId,
    error,
  };
}
