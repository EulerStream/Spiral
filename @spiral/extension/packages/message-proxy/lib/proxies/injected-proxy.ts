import {BaseMessageProxy, ProxyEventSource, ProxyMessagePacket} from "../base-proxy";
import {EventEmitter} from "events";

export class InjectedMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    window.addEventListener("message", this.receiveProxiedMessage.bind(this));
  }

  /** Injected -> Content -> ? */
  emit(type: string, to: ProxyEventSource, data: any): boolean {
    const messagePacket: ProxyMessagePacket<any> = {
      from: ProxyEventSource.INJECTED,
      to: to,
      type: type,
      data: data
    }

    if (to === ProxyEventSource.INJECTED) {
      throw new Error("InjectedMessageProxy cannot emit messages to itself!")
    }

    window.postMessage(messagePacket, "*");
    return true;
  }

  /** Injected <- Content <- ? */
  receiveProxiedMessage(event: MessageEvent) {

    if (event.source !== window) {
      return;
    }

    const messagePacket = event.data as ProxyMessagePacket<any>;
    EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
  }

  onUnmount() {
    window.removeEventListener("message", this.receiveProxiedMessage.bind(this));
  }

}


