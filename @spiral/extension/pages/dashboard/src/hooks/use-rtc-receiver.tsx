import { useEffect, useState } from "react";
import { useStorage } from "@extension/shared/lib/hooks";
import { settingStorage } from "@extension/storage/lib";

if (!import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER) {
  throw new Error('VITE_PUBLIC_SIGNALLING_SERVER is not defined in the environment!');
}

if (!import.meta.env.VITE_PUBLIC_STUN_SERVER) {
  throw new Error('VITE_PUBLIC_STUN_SERVER is not defined in the environment!');
}

interface WebSocketProps {
  webRtcSignallingServer: string;
  addConnection: (dc: RTCDataChannel, pc: RTCPeerConnection) => void;
  removeConnection: (id: string) => void; // Added for removal of connections
  reject: (reason?: any) => void;
}

interface RTCRefData {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
}

function createRtcReceiver({ webRtcSignallingServer, addConnection, removeConnection, reject }: WebSocketProps) {
  const ws = new WebSocket(webRtcSignallingServer);
  console.log('Connecting to WebSocket:', webRtcSignallingServer);

  ws.onmessage = async (event: MessageEvent) => {
    const message = JSON.parse(await new Response(event.data).text());

    if (message.sdp && message.sdp.type === "offer") {
      console.log("Received SDP Offer from server...");
      const config = { iceServers: [] };
      const pc = new RTCPeerConnection(config);
      await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          ws.send(JSON.stringify({ candidate: event.candidate }));
        }
      };

      pc.ondatachannel = (event) => {
        const dc = event.channel;

        dc.onopen = () => {
          console.log("Receiver: Data Channel Opened");
          addConnection(dc, pc);
        };

        dc.onmessage = (e) => {
          console.log("Receiver got message:", e.data);
        };

        dc.onerror = (err) => {
          console.error("Receiver: Data Channel Error:", err);
        };

        dc.onclose = () => {
          console.log("Receiver: Data Channel Closed");
          removeConnection(dc.label); // Update state to remove closed connection
        };
      };

      pc.oniceconnectionstatechange = () => {
        console.log("Receiver: ICE Connection State:", pc.iceConnectionState);
        if (pc.iceConnectionState === "disconnected") {
          pc.close();
        }
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify({sdp: answer}));
      console.log("Sending answer to server...");
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket Error:", err);
    reject(`WebSocket error: ${err}`);
  };

  ws.onclose = () => {
    console.log("WebSocket closed.");
  };

  return () => {
    console.log("Cleaning up WebSocket connection...");
    ws.close();
  };
}

export function useRtcReceiver() {
  const [connections, setConnections] = useState<Map<string, RTCRefData>>(new Map());
  const { agentId } = useStorage(settingStorage);
  const webRtcSignallingServer = `${import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER}?type=webrtc&sessionId=${agentId}`;

  useEffect(() => {
    const cleanUp = createRtcReceiver({
      webRtcSignallingServer,
      addConnection: (dc, pc) => {
        setConnections(prev => new Map(prev).set(dc.label, { dc, pc }));
      },
      removeConnection: (id) => {
        setConnections(prev => {
          const newConnections = new Map(prev);
          newConnections.delete(id);
          return newConnections;
        });
      },
      reject: (error) => console.error("Failed to establish connection:", error)
    });

    return () => {
      connections.forEach(conn => {
        conn.pc.close();
        conn.dc.close();
      });
      cleanUp();
    };
  }, []);

  return { connections };
}