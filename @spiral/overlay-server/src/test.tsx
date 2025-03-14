import {useEffect, useState} from "react";


const pc = new RTCPeerConnection({
  iceServers: [{urls: "stun:stun.l.google.com:19302"}]
});
const dataChannel = pc.createDataChannel("dataChannel");

export default function WebRTCClient() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  const url = new URL(window.location.href);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    console.error("No Session ID")
    return;
  }

  const signalingServerUrl = `ws://127.0.0.1:8080?type=webrtc&sessionId=${sessionId}`;

  useEffect(() => {
    const wsClient = new WebSocket(signalingServerUrl);
    setWs(wsClient);

    wsClient.onmessage = async (event) => {

      // event.data is a blob, convert to string
      const eventDataStr = await new Response(event.data).text();
      const message = JSON.parse(eventDataStr);

      if (message.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
        if (message.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          wsClient.send(JSON.stringify({sdp: answer}));
        }
      } else if (message.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };

    dataChannel.onopen = () => console.log("Data channel open");
    dataChannel.onmessage = (event) => console.log("Received:", event.data);

    return () => {
      return wsClient.close()

    };
  }, []);

  const connect = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log('Sending Message!')
    ws?.send(JSON.stringify({sdp: offer}));
  };

  return (
      <div>
        <button onClick={connect}>Connect to Peer</button>
        <p>Session ID: {sessionId}</p>
      </div>
  );
}
