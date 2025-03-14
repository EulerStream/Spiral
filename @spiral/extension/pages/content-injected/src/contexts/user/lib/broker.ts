import Logger from "@extension/shared/dist/lib/logger";

export class SpiralBroker {

  private ws?: WebSocket;
  private clientIdMutationObserver?: MutationObserver;

  constructor() {
    const initializationInterval = setInterval(() => {
      if (!this.clientId) {
        return;
      }
      clearInterval(initializationInterval);
      this.setWs();
      this.registerMutationObserver();
    }, 100);
  }

  private registerMutationObserver(): void {
    this.clientIdMutationObserver = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'spiral-client-id') {
          Logger.info('Client ID changed, reconnecting WebSocket...');
          this.setWs();
        }
      }
    });

    this.clientIdMutationObserver.observe(document.getElementById("spiral")!, {
      attributes: true,
      attributeFilter: ['spiral-client-id']
    });

  }

  private setWs(): void {
    if (this.ws) {
      this.ws.close();
    }


    if (!this.wsHost) {
      Logger.error('Invalid wsHost!');
      return;
    }

    const connectUri: string = `ws://${this.wsHost}?clientId=${this.clientId}`;
    Logger.info(`Connecting to Spiral-Server WebSocket at ${connectUri} `);

    this.ws = new WebSocket(`ws://${this.wsHost}?clientId=${this.clientId}`);
    this.ws.onmessage = (message: MessageEvent) => this.onMessage(message);
    this.ws.onopen = () => Logger.info('Spiral-Server WebSocket connected!');
    this.ws.onclose = () => Logger.info('Spiral-Server WebSocket disconnected!');
  }

  private changeTo(roomId: string) {
    window.location.href = `https://m.tiktok.com/share/live/${roomId}/`;
  }

  public send(newUrl: string) {
    const ttwid = this.ttwid;

    if (!ttwid) {
      Logger.error('Failed to get ttwid');
      return;
    }

    const spiralData = {
      url: {raw: newUrl},
      userAgent: navigator.userAgent,
      ttwid: ttwid
    }

    Logger.info('Sending Spiral Data:', spiralData);
    this.ws?.send(JSON.stringify(spiralData));
  }

  private async onMessage(message: MessageEvent) {
    try {
      const messageData: Blob = message.data;
      const messageJson = JSON.parse(await messageData.text());
      if (messageJson.type === 'Spiral.Request') {
        this.changeTo(messageJson.roomId);
      }
    } catch (e) {
      Logger.error('Failed to parse WebSocket message:', e);
    }
  }

  get ttwid(): string | undefined {
    return document.getElementById('spiral')?.getAttribute('spiral-ttwid') ?? undefined;
  }

  get wsHost() {
    if (this.isDev) {
      return '127.0.0.1:8000';
    }

    return 'spiral.eulerstream.com';
  }

  get isDev(): boolean {
    return document.getElementById("spiral")?.getAttribute("spiral-mode") === "development";
  }

  get clientId(): string | undefined {
    return document.getElementById("spiral")?.getAttribute("spiral-client-id") ?? undefined;
  }

}