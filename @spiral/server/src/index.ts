import {configDotenv} from "dotenv";

configDotenv();

import {SocketManager} from "./modules/manager";
import express, {Request, Response} from "express";
import {createServer} from "http";
import {WebSocketServer} from "ws";
import cors from "cors";
import {SpiralData} from "./modules/schemas";
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});
const manager = new SocketManager();

app.use(cors());
const SPIRAL_ID_PATTERN = /^spiral-[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

wss.on("connection", (ws, req) => {

  if (!req.url) {
    ws.close(4001, "No key passed");
    return;
  }

  if (req.url.startsWith("/")) {
    req.url = `http://localhost:${PORT}` + req.url;
  }

  const url = new URL(req.url);
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

  if (manager.has(clientId)) {
    ws.close(4409, "Client already connected");
    return;
  }

  // Add client to manager
  manager.register(clientId, ws);

});

function successfulResponse(res: Response, data: {metadata: SpiralData, response: Buffer}) {
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

  if (!manager.has(preferred_agent_id)) {
    return res.status(404).json({status: 404, message: "Preferred agent not connected"});
  }

  const data = await manager.fetchSpiralData(preferred_agent_id, roomId);
  if (data !== null) {
    return successfulResponse(res, data);
  }

  // Send the request
  if (!await manager.requestSpiralData(preferred_agent_id, roomId)) {
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

      const data = await manager.fetchSpiralData(preferred_agent_id, roomId);

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
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
