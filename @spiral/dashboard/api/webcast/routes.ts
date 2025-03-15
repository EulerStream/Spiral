import {SpiralData} from "@/api/ws/modules/schemas";
import {SPIRAL_ID_PATTERN} from "@/api/ws/manager";
import e, {Router} from "express";

export const router = Router();

function successfulResponse(res: e.Response, data: { metadata: SpiralData, response: Buffer }) {
  res.setHeader("Content-Type", "application/protubuf");
  res.setHeader("X-Set-TT-Cookie", `ttwid=${data.metadata.ttwid}`);
  res.send(data.response);
}


router.post("/fetch", async (req: e.Request, res: e.Response): Promise<void> => {
  const roomId = req.query.room_id as string | null;
  const preferred_agent_id = req.query.preferred_agent_id as string | null;
  const agentManager = globalThis.WebSocketManager.agentManager;

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
    res.status(404).json({status: 404, message: "Preferred agent not connected"});
    return;
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
  await new Promise<void>((resolve) => {
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
  });


});