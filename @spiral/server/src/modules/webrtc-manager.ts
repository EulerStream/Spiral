import {WebSocket} from "ws";
import {parse} from "node:url";
import {IncomingMessage} from "node:http";

export default class WebRTCSessionManager {

  private sessions: Record<string, Set<WebSocket>> = {};

  public manage(ws: WebSocket, req: IncomingMessage) {
    const { query } = parse(req.url ?? '', true);
    const sessionId = query.sessionId as string;

    if (!sessionId) {
      console.log('No Session ID')
      ws.close();
      return;
    }

    // Add client to the session
    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = new Set();
    }

    this.sessions[sessionId].add(ws);

    ws.on('message', (message) => {
      const peers = this.sessions[sessionId];
      if (peers) {
        // buffer to utf8
        console.log("Sending message to peers:", message.toString('utf8'));
        peers.forEach(client => {
          if (client !== ws && client.readyState === 1) {
            client.send(message);
          }
        });
      }
    });

    ws.on('close', () => {
      console.log('Closing...')
      this.sessions[sessionId]?.delete(ws);
      if (this.sessions[sessionId]?.size === 0) {
        delete this.sessions[sessionId]; // Cleanup empty sessions
      }
    });


  }

}