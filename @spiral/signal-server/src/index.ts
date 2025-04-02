import express, {Express} from 'express';
import {createServer} from 'http';
import {WebSocketServer} from "ws";
import WebSocketManager from "./modules/ws/manager";
import {configDotenv} from "dotenv";

configDotenv({path: process.env.ENV_PATH});

const port = parseInt(process.env.HTTP_API_PORT || '3001', 10);
const expressServer: Express = express() as Express;
const httpServer = createServer(expressServer);
const wssServer = new WebSocketServer({noServer: true});
const socketManager = new WebSocketManager(wssServer);

httpServer.on("upgrade", (req, socket, head) => {
  wssServer.handleUpgrade(req, socket, head, (ws, req) => {
    wssServer.emit('connection', ws, req);
  });
});

httpServer.listen(port, '0.0.0.0', () => console.log(`> HTTP Api ready on http://0.0.0.0:${port}`));
