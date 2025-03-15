import {AgentSocketManager} from "./modules/agent-manager";
import express, {Request, Response} from "express";
import {createServer} from "http";
import {WebSocketServer} from "ws";
import cors from "cors";
import {SpiralData} from "./modules/schemas";
import WebRTCSessionManager from "./modules/webrtc-manager";


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});
const agentManager = new AgentSocketManager();
const sessionManager = new WebRTCSessionManager();

app.use(cors());


app.get('/webcast/fetch', async (req: Request, res: Response) => {


});


