import React, {createContext, useContext, useEffect, useRef} from "react";
import {useStorage} from "@extension/shared/lib/hooks";
import {settingStorage} from "@extension/storage/lib";
import {spiralUuid4} from "@src/app/Settings";
import {useWidgetConnections} from "@src/hooks/use-widget-connections";

interface ExtensionConnectorProps {
  debugMode: boolean;
  children: React.ReactNode;
}

interface ExtensionConnectionContextValue {
  agentId: string | null;
  connections: Record<string, unknown>;
  peerId: string | null;
  connected: boolean;
  error: string | null;
}

const ExtensionConnectionContext = createContext<ExtensionConnectionContextValue | undefined>(undefined);

export function useExtensionConnections() {
  const context = useContext(ExtensionConnectionContext);
  if (!context) {
    throw new Error("useExtensionConnections must be used within an ExtensionConnectionProvider");
  }
  return context;
}

export function ExtensionConnectionProvider({debugMode, children}: ExtensionConnectorProps) {
  const {agentId} = useStorage(settingStorage);
  const sentDebugRef = useRef(false);

  const {connections, peerId, connected, error} = useWidgetConnections(agentId);

  // Ensure agentId is generated if missing
  useEffect(() => {
    if (!agentId) {
      settingStorage.updateSettings({agentId: spiralUuid4()});
    }
  }, [agentId]);

  useEffect(() => {
    if (debugMode && !sentDebugRef.current) {
      console.info("Signalling Server URI:", import.meta.env.VITE_PUBLIC_SIGNALLING_SERVER);
      sentDebugRef.current = true;
    }
  }, [debugMode]);

  return (
      <ExtensionConnectionContext.Provider value={{agentId, connections, peerId, connected, error}}>
        {debugMode && (
            <div style={{
              color: "rgb(1,1,1)",
              background: "rgb(140,225,235)",
              marginTop: "5px",
              borderRadius: "5px",
              padding: "10px 20px",
            }}>
              <p><strong>Session Id:</strong> {agentId}</p>
              <p><strong>Peer Id:</strong> {peerId}</p>
              <p><strong>Connected Peers:</strong> {Object.keys(connections).join(", ")}</p>
              <p><strong>Is Connected:</strong> {connected ? "Yes" : "No"}</p>
              {error && <p style={{color: "red"}}><strong>Error:</strong> {error}</p>}
            </div>
        )}
        {children}
      </ExtensionConnectionContext.Provider>
  );
}
