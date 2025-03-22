/** WebRTC Client Connection for Widgets **/
import {useEffect, useRef, useState} from "react";

if (!import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER) {
  throw new Error('VITE_PUBLIC_SIGNALLING_SERVER is not defined in the environment!');
}

if (!import.meta.env.VITE_PUBLIC_STUN_SERVER) {
  throw new Error('VITE_PUBLIC_STUN_SERVER is not defined in the environment!');
}

export const sessionId = new URL(location.href).searchParams.get('sessionId')
const webRtcSignallingServer = `${import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER}?type=webrtc&sessionId=${sessionId}`;

export enum RTCConnectionState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED"
}

interface WebSocketProps {
  resolve: (value: RTCDataChannel) => void;
  reject: (reason?: any) => void;
}

interface RTCRefData {
  pc?: RTCPeerConnection;
  dc?: RTCDataChannel;
}

function createRtcConnection({resolve, reject}: WebSocketProps): () => void {
  let rtcDataRef: RTCRefData = {};
  const remoteCandidatesBuffer: RTCIceCandidateInit[] = [];
  let remoteDescriptionSet = false;

  /** When the WS connects, update the hook state **/
  const onWsConnected = async () => {
    console.log("Connected to the Signal Server WebSocket");
    const pc = new RTCPeerConnection({iceServers: [{urls: import.meta.env.VITE_PUBLIC_STUN_SERVER}]});
    const dc = pc.createDataChannel("dataChannel");

    // Set the data channel reference
    rtcDataRef = {pc, dc};

    // On channel open, resolve the channel
    dc.onopen = () => {
      console.log("Data Channel Opened");
      resolve(dc);
      ws.close();
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to server:", event.candidate);
        ws.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("PeerConnection State:", pc.connectionState);
    };

    console.log("DataChannel initial state:", dc.readyState);

    dc.onopen = () => {
      console.log("Data Channel Opened");
      resolve(dc);
      ws.close();
    };

    dc.onclose = () => {
      console.log("Data Channel Closed");
    };

    // On error, reject the channel
    dc.onerror = (ev) => reject(`Data Channel Connection Error ${ev}`);

    // Send an offer to the server
    const offer = await rtcDataRef.pc!.createOffer();
    await rtcDataRef.pc!.setLocalDescription(offer);
    console.log("Sending SDP Offer to server...")
    ws.send(JSON.stringify({sdp: offer}));
  }

  /** WebSocket connection error **/
  const onWsError = (err: any) => {
    console.error('WebSocket error event:', err);
    console.error('WebSocket readyState:', ws.readyState);
    reject(`WebSocket error: ${JSON.stringify(err)}`);
  }

  /** Should be closed when the RTC Connection is complete **/
  const onWsClose = () => {
    console.log('Signal Server WebSocket closed.')
  }

  /** Handle incoming messages to create the connection **/
  const onWsMessage = async (event: MessageEvent) => {
    const eventDataStr = await new Response(event.data).text();
    const message = JSON.parse(eventDataStr);

    if (message.sdp && message.sdp.type === "answer") {
      console.log("Received SDP answer from server", true);
      await rtcDataRef.pc!.setRemoteDescription(new RTCSessionDescription(message.sdp));
      remoteDescriptionSet = true;

      // Apply any buffered ICE candidates
      for (const candidate of remoteCandidatesBuffer) {
        console.log("Applying buffered ICE candidate");
        await rtcDataRef.pc!.addIceCandidate(new RTCIceCandidate(candidate));
      }

      remoteCandidatesBuffer.length = 0; // clear the buffer
    }

    if (message.candidate) {
      console.log("Received ICE candidate from server:", message.candidate);
      if (remoteDescriptionSet) {
        await rtcDataRef.pc!.addIceCandidate(new RTCIceCandidate(message.candidate));
      } else {
        console.log("Buffering ICE candidate until remoteDescription is set");
        remoteCandidatesBuffer.push(message.candidate);
      }
    }
  };


  // Create a new WebSocket connection
  const ws = new WebSocket(webRtcSignallingServer);

  // Register listeners
  ws.onopen = () => onWsConnected().then(() => console.log('RTC WebSocket Connected'));
  ws.onerror = onWsError;
  ws.onclose = onWsClose;
  ws.onmessage = (msg) => onWsMessage(msg).catch((err) => console.error(err));

  // Set the WebSocket reference
  setTimeout(() => reject("Timeout creating a WebRTC Extension Connection"), 15000);

  // Gracefully handle cleanup
  return () => {
    console.log("Cleaning up RTC Connection...");

    if (rtcDataRef.pc) {
      rtcDataRef.pc.close();
    }

    if (rtcDataRef.dc) {
      rtcDataRef.dc.close();
    }

    if (ws.readyState === ws.OPEN) {
      console.log("WebSocket open, closing for clean-up...")
      ws.close();
    }
  };
}

export function useExtensionConnection() {
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [connectionState, setConnectionState] = useState<RTCConnectionState>(RTCConnectionState.CONNECTING);

  const isConnectingRef = useRef(false); // 🔒 prevent duplicate attempts

  const onWindowUnload = () => {
    if (dataChannel) {
      dataChannel.close();
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', onWindowUnload);

    let onCleanup: () => void = () => {
      window.removeEventListener('beforeunload', onWindowUnload);
    };

    if (typeof RTCPeerConnection === "undefined") {
      alert("WebRTC is not supported in this browser!");
      return;
    }

    if (connectionState === RTCConnectionState.CONNECTED || isConnectingRef.current) {
      return;
    }

    if (connectionState === RTCConnectionState.CONNECTING) {
      isConnectingRef.current = true;
      console.log("Creating a new RTC Connection...");

      new Promise<RTCDataChannel>((resolve, reject) => {
        onCleanup = createRtcConnection({resolve, reject});
      })
          .then((dc) => {
            setDataChannel(dc);
            setConnectionState(RTCConnectionState.CONNECTED);
          })
          .catch((reason) => {
            console.error("Failed to connect to RTC Data Channel due to reason:", reason);
            setConnectionState(RTCConnectionState.DISCONNECTED);
          })
          .finally(() => {
            isConnectingRef.current = false;
          });
    }

    if (connectionState === RTCConnectionState.DISCONNECTED) {
      console.log("RTC Disconnected, re-connecting in 5000ms...");
      setDataChannel(null);
      setTimeout(() => setConnectionState(RTCConnectionState.CONNECTING), 5000);
    }

    return () => {
      onCleanup();
      window.removeEventListener('beforeunload', onWindowUnload);
    };
  }, [connectionState]);

  return {dataChannel, connectionState};
}

