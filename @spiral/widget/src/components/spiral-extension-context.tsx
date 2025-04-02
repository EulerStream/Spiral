import React, {createContext, ReactNode, useContext, useEffect} from "react";
import {useSearchConfig} from "../hooks/use-search-config";
import './spiral-extension-context.css';
import {PeerInitiatorHookData, useExtensionConnection} from "../hooks";

const SpiralExtensionContext = createContext<PeerInitiatorHookData | undefined>(undefined);

type SpiralExtensionProviderProps = {
  children: ReactNode;
};

export function SpiralExtensionProvider({children}: SpiralExtensionProviderProps) {
  const {sessionId} = useSearchConfig();
  const connectionState = useExtensionConnection(sessionId); // sessionId = remoteId here

  // Optionally, handle incoming messages
  useEffect(() => {
    const conn = connectionState.connection;
    if (!conn) return;

    const handleMessage = (data: any) => {
      console.log('Received RTC Message:', data);
    };

    conn.on('data', handleMessage);

    return () => {
      conn.off('data', handleMessage);
    };
  }, [connectionState.connection]);

  if (!sessionId) {
    return (
        <div className={'ExtensionChannelLoading'}>
          <h1>Session ID Not Available.</h1>
        </div>
    );
  }

  return (
      <SpiralExtensionContext.Provider value={connectionState}>
        {children}
      </SpiralExtensionContext.Provider>
  );
}

export function useConnectionState() {
  const context = useContext(SpiralExtensionContext);
  if (!context) {
    throw new Error("useSpiralExtensionContext must be used within a SpiralExtensionProvider");
  }
  return context;
}
