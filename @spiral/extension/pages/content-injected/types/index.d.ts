import {SpiralWebSocketManager} from "../../content-injected/wsManager";
import {SpiralBroker} from "../src/broker";
import {InjectedMessageProxy} from "@extension/message-proxy/dist/lib";

declare global {
  interface Document {
    __Spiral__: {
      Manager?: SpiralWebSocketManager;
      Broker?: SpiralBroker;
      MessageProxy: InjectedMessageProxy
    };
    protobuf: Proto;
    querySelectorWait: (selector: string, timeout: number, startDelay?: number) => Promise<Element>;
    querySelectorHide: (...selectors: string[]) => void;
  }
  interface WebSocket {
    onsend: (data: Uint8Array) => any;
  }
}

export {};
