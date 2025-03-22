import React from 'react';
import {useRtcReceiver} from "@src/hooks/use-rtc-receiver";

const WebRtcConnectionMonitor = () => {
  const { connections } = useRtcReceiver();

  return (
      <div>
        <h1>WebRTC Connection Monitor</h1>
        <p>Number of Active Connections: {connections.size}</p>
        <ul>
          {Array.from(connections.keys()).map((key, index) => (
              <li key={index}>
                Connection ID: {key} - State: {connections.get(key)?.dc.readyState}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default WebRtcConnectionMonitor;
