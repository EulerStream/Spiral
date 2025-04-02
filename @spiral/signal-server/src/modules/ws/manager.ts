import {WebSocket, WebSocketServer,} from "ws";
import {IncomingMessage} from "node:http";
import RedisClient from "ioredis";
import Redis, {RedisOptions} from "ioredis";
import {AgentSocketManager} from "./modules/agent-manager";
import WebRTCSessionManager from "./modules/webrtc-manager";

export const SPIRAL_ID_PATTERN = /^spiral-[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function createRedis() {

  const ConnectOptions: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD
  };

  return new RedisClient(ConnectOptions);
}


export default class WebSocketManager {

  private readonly redis: Redis = createRedis();
  public readonly agentManager: AgentSocketManager = new AgentSocketManager(this.redis);
  public readonly sessionManager: WebRTCSessionManager = new WebRTCSessionManager();

  constructor(
      private readonly wss: WebSocketServer,
  ) {
    this.wss.on("connection", this.onConnection.bind(this));
  }

  onConnection(ws: WebSocket, req: IncomingMessage) {
    console.log("Intercepted connection...")
    const searchParams: URLSearchParams = new URL(req.url!, "http://dummy-url").searchParams;
    const webSocketType = searchParams.get('type');

    switch (webSocketType) {
      case 'agent':
        // Todo add agent support again
        // this.handleAgentConnection(ws, url);
        break;
      case 'webrtc':
        this.handleWebRtcBrokerConnection(ws, req, searchParams);
        break;
      default:
        console.log('C2')
        ws.close(4001, "Invalid type");
    }


    ws.on("close", (code, reason) => {
      console.log("WebSocket closed inside sessionManager. Code:", code, "Reason:", reason);
    });

  }

  private handleWebRtcBrokerConnection(ws: WebSocket, req: IncomingMessage, searchParams: URLSearchParams) {
    console.log("Managing WebRTC...")
    this.sessionManager.manage(ws, req, searchParams);
  }

  private handleAgentConnection(ws: WebSocket, url: URL) {

    if (!url.searchParams.has('clientId')) {
      console.log("C3")
      ws.close(4001, "No clientId passed");
      return;
    }

    // Should match the structure spiral-<uuid4>
    const clientId = url.searchParams.get('clientId');
    if (!clientId || !clientId.startsWith('spiral-')) {
      console.log("c4")
      ws.close(4001, "Invalid clientId");
      return;
    }

    if (!SPIRAL_ID_PATTERN.test(clientId)) {
      console.log("c6")
      ws.close(4001, "Invalid clientId format");
      return;
    }

    if (this.agentManager.has(clientId)) {
      console.log("c7")
      ws.close(4409, "Client already connected");
      return;
    }

    // Add client to manager
    this.agentManager.register(clientId, ws);
  }


}

