import {WebSocket} from "ws";
import {IncomingMessage} from "http";

type Session = {
  agent: WebSocket | null;
  widgets: Map<string, WebSocket>;
};

export default class WebRTCSessionManager {
  private sessions: Record<string, Session> = {};

  public manage(ws: WebSocket, req: IncomingMessage, searchParams: URLSearchParams) {
    const sessionId = searchParams.get("sessionId");
    const sessionRole = searchParams.get("sessionType") as "agent" | "widget";
    const attemptId = searchParams.get("attemptId") || crypto.randomUUID();

    if (!sessionId || !sessionRole) {
      ws.send(JSON.stringify({error: "Missing sessionId and/or sessionType"}));
      ws.close(4001);
      return;
    }

    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = {
        agent: null,
        widgets: new Map(),
      };
    }

    const session = this.sessions[sessionId];

    if (sessionRole === "agent") {
      if (session.agent) {
        ws.send(JSON.stringify({error: "Agent already connected"}));
        ws.close(4001, "Agent already connected");
        return;
      }
      session.agent = ws;
      console.log(`Agent connected to session ${sessionId}`);
    } else if (sessionRole === "widget") {
      session.widgets.set(attemptId, ws);
      console.log(`Widget ${attemptId} connected to session ${sessionId}`);

      if (session.agent) {
        session.agent.send(
            JSON.stringify({type: "widget-joined", widgetId: attemptId})
        );
      }
    } else {
      ws.send(JSON.stringify({error: `Invalid sessionType: ${sessionRole}`}));
      ws.close(4001, "Invalid sessionType");
      return;
    }

    ws.on("message", (raw) => {
      let message;
      try {
        message = JSON.parse(raw.toString());
      } catch (err) {
        ws.send(JSON.stringify({error: "Invalid JSON message"}));
        return;
      }

      const isAgent = session.agent === ws;

      if (isAgent) {
        const {targetId, type, ...rest} = message;
        const targetWidget = session.widgets.get(targetId);
        if (targetWidget) {
          targetWidget.send(
              JSON.stringify({type, ...rest})
          );
        }
      } else {
        if (session.agent) {
          session.agent.send(
              JSON.stringify({
                ...message,
                id: attemptId,
              })
          );
        }
      }
    });

    ws.on("close", () => {
      const isAgent = session.agent === ws;
      console.log(`Connection closed: ${sessionRole}`);

      if (isAgent) {
        session.agent = null;
      } else {
        session.widgets.delete(attemptId);
        if (session.agent) {
          session.agent.send(
              JSON.stringify({type: "widget-left", widgetId: attemptId})
          );
        }
      }

      if (!session.agent && session.widgets.size === 0) {
        delete this.sessions[sessionId];
        console.log(`Session ${sessionId} cleaned up`);
      }
    });
  }
}
