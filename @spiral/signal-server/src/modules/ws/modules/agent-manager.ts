import {RawData, WebSocket} from 'ws';
import {ClientSpiralPayload, clientSpiralSchema, SpiralData, spiralDataSchema} from "./schemas";
import {SafeParseReturnType} from "zod";
import {WebcastResponse} from "../proto/tiktok-schema";
import RedisClient from "ioredis";

function debugErrors(errors: any) {

  // print the error & the path
  for (let error of errors) {
    console.debug('----');
    console.debug(`Error: ${error.message} - Path: ${error.path.join('.')}`);
  }

}

export class AgentSocketManager {

  constructor(
      private redis: RedisClient,
  ) {
  }

  // WebSockets
  private webSockets: Record<string, WebSocket> = {};

  public has(clientId: string) {
    return !!this.webSockets[clientId];
  }

  public register(clientId: string, ws: WebSocket) {
    console.log('Registering client', clientId);
    ws.on('close', () => this.deregister(clientId));
    ws.on('message', async (message: RawData) => this.onMessage(clientId, message));
    this.webSockets[clientId] = ws;
  }

  /**
   * Handle incoming messages
   *
   * @param clientId The client ID
   * @param message The message
   */
  private async onMessage(clientId: string, message: RawData): Promise<void> {
    let jsonData: any;
    try {
      jsonData = JSON.parse(message.toString())
    } catch (ex) {
      console.debug('Failed to parse message', ex);
      return;
    }

    const parseResponse = clientSpiralSchema.safeParse(jsonData);
    if (!parseResponse.success) {
      console.debug('Failed to parse client payload');
      debugErrors(parseResponse.error.errors);
      return;
    }

    const payloadParseResponse = this.parse(jsonData);
    if (!payloadParseResponse.success) {
      console.debug('Failed to parse payload');
      debugErrors(payloadParseResponse.error.errors);
      return;
    }

    // Create the WebcastResponse
    const webcastResponse = WebcastResponse.fromPartial({
      pushServer: payloadParseResponse.data.url.data.pushServer,
      routeParamsMap: payloadParseResponse.data.url.data.routeParams,
      isFirst: true,
      internalExt: payloadParseResponse.data.url.data.internalExt,
      cursor: payloadParseResponse.data.url.data.cursor,
    })

    console.debug('Set WebcastResponse successfully...')

    // They're only valid for 30 seconds
    await this.redis.set(
        `spiral:${clientId}:${payloadParseResponse.data.url.data.roomId}`,
        Buffer.from(WebcastResponse.encode(webcastResponse).finish()),
        'EX',
        30
    );

    await this.redis.set(
        `spiral:${clientId}:${payloadParseResponse.data.url.data.roomId}:metadata`,
        JSON.stringify(payloadParseResponse.data),
        'EX',
        60 // Last a little extra
    );

  }

  public async requestSpiralData(clientId: string, roomId: string): Promise<boolean> {
    const ws = this.webSockets[clientId];
    if (!ws) return false;
    ws.send(Buffer.from(JSON.stringify({type: 'Spiral.Request', roomId: roomId})));
    return true;
  }

  public async fetchSpiralData(clientId: string, roomId: string): Promise<{metadata: SpiralData, response: Buffer} | null> {
    const data = await this.redis.getBuffer(`spiral:${clientId}:${roomId}`);
    if (!data) return null;
    const metaData = await this.redis.get(`spiral:${clientId}:${roomId}:metadata`);
    return {
      metadata: JSON.parse(metaData!),
      response: data
    };
  }

  /**
   * Parse the client payload for the connection details
   *
   * @param clientPayload The client payload
   */
  private parse(clientPayload: ClientSpiralPayload): SafeParseReturnType<any, any> {
    const url = new URL(clientPayload.url.raw);
    const imprp = url.searchParams.get('imprp')!;
    const wrss = url.searchParams.get('wrss')!;
    const roomId = url.searchParams.get('room_id')!;
    const cursor = url.searchParams.get('cursor')!;
    const internalExt = url.searchParams.get('internal_ext')!;

    const spiralData: SpiralData = {
      url: {
        raw: clientPayload.url.raw,
        data: {
          // pushServer is everything before query parameters
          pushServer: clientPayload.url.raw.split('?')[0],
          routeParams: {
            imprp: imprp ?? undefined,
            wrss: wrss ?? undefined
          },
          roomId,
          cursor,
          internalExt
        }
      },
      userAgent: clientPayload.userAgent,
      ttwid: clientPayload.ttwid,
    };

    return spiralDataSchema.safeParse(spiralData);
  }

  /**
   * Deregister a client when they disconnect
   *
   * @param clientId The client ID
   * @private This method is private
   */
  private deregister(clientId: string) {
    console.log('De-registering client', clientId);

    const webSocket = this.webSockets[clientId];

    if (!webSocket) {
      return;
    }

    if (webSocket.readyState === WebSocket.OPEN) {
      console.log("c8")
      webSocket.close();
    }

    delete this.webSockets[clientId];

  }

}