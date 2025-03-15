import express, {Express} from 'express';
import {createServer} from 'http';
import next from 'next';
import WebSocket from 'ws';
import {router as WebcastRouter} from "./webcast/routes"
import WebSocketManager from "@/api/ws/manager";

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server: Express = express() as Express;
  server.wsm = new WebSocketManager();

  // Handle API routes specifically
  server.use('/webcast', WebcastRouter);

  const httpServer = createServer(server);

  // Catch-all handler for Next.js pages, explicitly excluding API paths
  server.get('*', (req, res, next) => {
    const path = req.path;
    if (path.startsWith('/api') || path.startsWith('/webcast')) { // Customize this check as necessary
      return next();
    }
    return handle(req, res);
  });

  httpServer.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith("/ws")) {
      server.wsm.wss.handleUpgrade(req, socket, head, (ws) => {
        server.wsm.wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  server.wsm.wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection established');
    ws.on('message', (message: string) => {
      console.log('received: %s', message);
      ws.send(message);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
