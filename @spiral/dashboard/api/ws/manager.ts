import {WebSocket, WebSocketServer,} from "ws";
import {AgentSocketManager} from "@/api/ws/modules/agent-manager";
import WebRTCSessionManager from "@/api/ws/modules/webrtc-manager";
import {IncomingMessage} from "node:http";
import RedisClient from "ioredis";
import Redis, {RedisOptions} from "ioredis";

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
  public readonly wss: WebSocketServer = new WebSocketServer({noServer: true});
  public readonly agentManager: AgentSocketManager = new AgentSocketManager(this.redis);
  public readonly sessionManager: WebRTCSessionManager = new WebRTCSessionManager();

  constructor() {
    this.wss.on("connection", this.onConnection.bind(this));
  }

  onConnection(ws: WebSocket, req: IncomingMessage) {

    if (!req.url) {
      ws.close(4001, "No URL passed");
      return;
    }

    if (req.url.startsWith("/")) {
      req.url = `http://localhost:3000` + req.url;
    }

    const url = new URL(req.url);

    switch (url.searchParams.get('type')) {
      case 'agent':
        this.handleAgentConnection(ws, url);
        break;
      case 'webrtc':
        this.handleWebRtcBrokerConnection(ws, req);
        break;
      default:
        console.log('Closing')
        ws.close(4001, "Invalid type");
    }
  }


  private handleAgentConnection(ws: WebSocket, url: URL) {

    if (!url.searchParams.has('clientId')) {
      ws.close(4001, "No clientId passed");
      return;
    }

    // Should match the structure spiral-<uuid4>
    const clientId = url.searchParams.get('clientId');
    if (!clientId || !clientId.startsWith('spiral-')) {
      ws.close(4001, "Invalid clientId");
      return;
    }

    if (!SPIRAL_ID_PATTERN.test(clientId)) {
      ws.close(4001, "Invalid clientId format");
      return;
    }

    if (this.agentManager.has(clientId)) {
      ws.close(4409, "Client already connected");
      return;
    }

    // Add client to manager
    this.agentManager.register(clientId, ws);
  }

  private handleWebRtcBrokerConnection(ws: WebSocket, req: IncomingMessage) {
    this.sessionManager.manage(ws, req);
  }


}

