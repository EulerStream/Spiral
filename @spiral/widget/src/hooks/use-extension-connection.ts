import {use, useEffect, useRef, useState} from "react";
import Peer, {DataConnection, PeerJSOption} from "peerjs";
import {randomNonUniqueId} from "../lib/url-builder";

export type PeerInitiatorHookData = {
  connected: boolean;
  connection: DataConnection | null;
  error: string | null;
};


export function useExtensionConnection(remoteId: string, options?: PeerJSOption): PeerInitiatorHookData {
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000; // ms

  if (!remoteId) {
    return {
      connected: false,
      connection: null,
      error: "Remote ID not provided"
    }
  }

  useEffect(() => {
    if (error) {
      console.error("RTC connection failed with error. Reconnecting...", error);
    }
  }, [error]);

  useEffect(() => {
    let retries = 0;
    let isDestroyed = false;

    const initiateConnection = () => {
      if (isDestroyed) return;

      const peer = new Peer(randomNonUniqueId(), {
        ...options,
        host: import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER,
        secure: import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER_SECURE === "true",
      });

      peerRef.current = peer;

      peer.on("open", () => {
        if (isDestroyed) return;
        const conn = peer.connect(remoteId);
        connRef.current = conn;

        conn.on("open", () => {
          if (isDestroyed) return;
          setConnected(true);
          setError(null);
        });

        conn.on("error", (err) => {
          if (isDestroyed) return;
          setError(err.message);
          retry();
        });

        conn.on("close", () => {
          if (isDestroyed) return;
          setConnected(false);
          retry();
        });
      });

      peer.on("error", (err) => {
        if (isDestroyed) return;
        setError(err.message);
        retry();
      });
    };

    const retry = () => {
      if (++retries > MAX_RETRIES) return;
      setTimeout(() => {
        if (!isDestroyed) {
          peerRef.current?.destroy();
          initiateConnection();
        }
      }, RETRY_DELAY);
    };

    initiateConnection();

    return () => {
      isDestroyed = true;
      connRef.current?.close();
      peerRef.current?.destroy();
    };
  }, [remoteId]);

  return {
    connected,
    connection: connRef.current,
    error,
  };
}
