import {RTCConnectionState, sessionId, useExtensionConnection} from "../hooks/use-extension-connection";
import {ReactNode, useEffect, useRef} from "react";
import './extension-channel.css';

interface ExtensionConnectorProps {
  debugMode: boolean;
  width: number;
  height: number;
  children: ReactNode;
}

export default function ExtensionChannel({debugMode, children, width, height}: ExtensionConnectorProps) {
  const {dataChannel, connectionState} = useExtensionConnection();
  const isConnected = connectionState === RTCConnectionState.CONNECTED;
  const sentDebugRef = useRef(false);

  if (sessionId === null) {
    return (
        <div style={{width, height}} className={'ExtensionChannelLoading'}>
          <h1>Session ID Not Available.</h1>
        </div>
    )
  }

  const onMessage = (event: MessageEvent) => {
    console.log('Received Message:', event.data);
  }

  useEffect(() => {

    if (dataChannel) {
      dataChannel.onmessage = onMessage;
    }

  }, [connectionState]);


  useEffect(() => {
    if (debugMode && !sentDebugRef.current) {
      console.info("WebSocket URL:", import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER);
      console.info("STUN Server URL:", import.meta.env.VITE_PUBLIC_STUN_SERVER);
      sentDebugRef.current = true;
    }
  }, []);

  return (
      <div style={{width, height}}>
        {
          /* Show the children when connected */
          isConnected ? children : (
              <div className={"ExtensionChannelLoading pulse"}>
                <h1>Connecting to Extension...</h1>
              </div>
          )
        }
        {
          /* Extra data in debug mode */
            debugMode && (
                <div style={
                  {
                    color: "rgb(1,1,1)",
                    background: "rgb(140,225,235)",
                    marginTop: "5px",
                    borderRadius: "5px",
                    padding: "10px 20px",
                  }
                }>
                  <p><strong>Connection State:</strong> {connectionState}</p>
                </div>
            )
        }
      </div>
  );

}