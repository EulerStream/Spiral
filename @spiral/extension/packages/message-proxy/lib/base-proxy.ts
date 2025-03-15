import {EventEmitter} from "events";

export enum ProxyEventSource {
  CONTENT=  "CONTENT",
  BACKGROUND = "BACKGROUND",
  INJECTED = "INJECTED"
}

export type ProxyMessagePacket<T> = {
  from: ProxyEventSource;
  to: ProxyEventSource;
  type: string;
  data: T;
}

export type ProxyListener = (event: ProxyMessagePacket<any>) => void;

export abstract class BaseMessageProxy extends EventEmitter {

  public abstract onUnmount(): void;

  abstract emit(type: string, to: ProxyEventSource, data: any, specificHosts: string[] | undefined): boolean;

  on(type: string | number, listener: ProxyListener): this {
    return super.on(type, listener);
  }

}
