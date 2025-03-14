import Logger from "@extension/shared/dist/lib/logger";
import {SpiralBroker} from "@src/contexts/user/lib/broker";
import {EnterRoomMessage, WebcastPushFrame} from "@src/contexts/user/lib/tiktok-schema";


type SpiralWebSocket = WebSocket & { id: string, firstRoomId: string };

class SpiralWebSocketManager {

  /** WebSockets for each Room ID */
  public readonly WebSockets: Record<string, SpiralWebSocket> = {}

  add(ws: WebSocket) {

    // Must be a Webcast WS
    if (!ws.url.includes("/webcast/im/")) {
      return;
    }

    const url: URL = new URL(ws.url);
    const roomId: string | null = url.searchParams.get('room_id');

    // Webcast WebSockets have a Room ID
    if (!roomId) {
      Logger.error('Failed to get Room ID from Webcast WebSocket:', ws.url);
      return;
    }

    // Add the WebSocket to the Room ID
    (ws as SpiralWebSocket).id = roomId;
    this.WebSockets[roomId] = ws as SpiralWebSocket;
    this.WebSockets[roomId].firstRoomId = roomId;

    Logger.info(`Intercepted Webcast Connection for Room ID: ${roomId}`);
    ws.onclose = () => this.remove(ws as SpiralWebSocket);
    ws.onmessage = (message: MessageEvent) => this.onMessage(ws, message);
    ws.onsend = (data: any) => this.onSend(ws as SpiralWebSocket, data);
    this.sendToBroker(ws as SpiralWebSocket);
  }

  sendToBroker(ws: SpiralWebSocket) {
    Logger.info('Sending Webcast WebSocket URL to Broker');
    const broker: SpiralBroker = document.__Spiral__.Broker;
    broker.send(ws.url);
  }

  onMessage(ws: WebSocket, message: MessageEvent) {

  }

  onSend(ws: SpiralWebSocket, data: Uint8Array) {
    const pushMessage = WebcastPushFrame.decode(data);

    if (pushMessage.payloadType === 'im_enter_room') {
      const enterRoomMessage = EnterRoomMessage.decode(pushMessage.payload);
      const newId = enterRoomMessage.roomId;

      // Force a refresh if the Room ID changes
      if (newId !== ws.id) {
        if (this.isActive) {
          this.forceReconnect(ws);
        }
      }

    }

  }

  forceReconnect(ws: SpiralWebSocket) {
    ws.dispatchEvent(new CustomEvent(('error')))
  }

  remove(ws: SpiralWebSocket) {
    Logger.info(`Removed closed Webcast WebSocket for Room ID: ${ws.id}`);

    if (Object.keys(this.WebSockets).includes(ws.id)) {
      delete this.WebSockets[ws.id];
    }
  }

  get isActive() {
    return document.getElementById("spiral")!.getAttribute("spiral-active") === "1";
  }

}

export {SpiralWebSocketManager};