import {AgentSocketManager} from "./modules/agent-manager";
import express, {Request, Response} from "express";
import {createServer} from "http";
import {WebSocket, WebSocketServer} from "ws";
import cors from "cors";
import {SpiralData} from "./modules/schemas";
import WebRTCSessionManager from "./modules/webrtc-manager";
import {IncomingMessage} from "node:http";


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});
const agentManager = new AgentSocketManager();
const sessionManager = new WebRTCSessionManager();

app.use(cors());
const SPIRAL_ID_PATTERN = /^spiral-[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;


function handleAgentConnection(ws: WebSocket, url: URL) {


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

  if (agentManager.has(clientId)) {
    ws.close(4409, "Client already connected");
    return;
  }

  // Add client to manager
  agentManager.register(clientId, ws);
}


wss.on("connection", (ws, req) => {

  if (!req.url) {
    console.log('Closing 2')
    ws.close(4001, "No URL passed");
    return;
  }

  if (req.url.startsWith("/")) {
    req.url = `http://localhost:${PORT}` + req.url;
  }

  const url = new URL(req.url);

  switch (url.searchParams.get('type')) {
    case 'agent': // todo add back support to agent
      handleAgentConnection(ws, url);
      break;
    case 'webrtc':
      handleWebRtcBrokerConnection(ws, req);
      break;
    default:
      console.log('Closing')
      ws.close(4001, "Invalid type");
  }

});


function handleWebRtcBrokerConnection(ws: WebSocket, req: IncomingMessage) {
  console.log('...Handling WebRTC')
  sessionManager.manage(ws, req);
}


function successfulResponse(res: Response, data: { metadata: SpiralData, response: Buffer }) {
  console.log('Got ttwid', data.metadata);
  res.setHeader("Content-Type", "application/protubuf");
  res.setHeader("X-Set-TT-Cookie", `ttwid=${data.metadata.ttwid}`);
  res.send(data.response);
}

app.get('/webcast/fetch', async (req: Request, res: Response) => {

  const roomId = req.query.room_id as string | null;
  const preferred_agent_id = req.query.preferred_agent_id as string | null;

  if (!roomId || !preferred_agent_id) {
    res.status(400).json({status: 400, message: "Missing required parameters"});
    return;
  }

  if (!SPIRAL_ID_PATTERN.test(preferred_agent_id)) {
    res.status(400).json({status: 400, message: "Invalid preferred_agent_id format"});
    return;
  }

  if (roomId.length > 64) {
    res.status(400).json({status: 400, message: "Invalid room_id length"});
    return;
  }

  if (!agentManager.has(preferred_agent_id)) {
    return res.status(404).json({status: 404, message: "Preferred agent not connected"});
  }

  const data = await agentManager.fetchSpiralData(preferred_agent_id, roomId);
  if (data !== null) {
    return successfulResponse(res, data);
  }

  // Send the request
  if (!await agentManager.requestSpiralData(preferred_agent_id, roomId)) {
    res.status(500).json({status: 500, message: "Failed to request data"});
    return;
  }

  // Poll every 500ms for up to 15 seconds
  const maxTime = 15 * 1000;
  const attemptRate = 500;
  let currentTime = 0;

  // Wait for the data to be returned
  return await new Promise((resolve) => {
    const interval = setInterval(async () => {
      currentTime += attemptRate;

      if (currentTime >= maxTime) {
        clearInterval(interval);
        res.status(408).json({status: 404, message: "Spiral data not returned"});
        resolve();
      }

      const data = await agentManager.fetchSpiralData(preferred_agent_id, roomId);

      if (data === null) {
        return;
      }

      successfulResponse(res, data);
      resolve();
      clearInterval(interval);
    }, attemptRate);
  })

});


/**
 * Health Check
 */
app.get("/health_check", (_: Request, res: Response) => {
  res.status(200).send("OK");
});

/**
 * Launch App
 */
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
