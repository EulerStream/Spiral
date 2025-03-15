import {BaseMessageProxy, ProxyEventSource, ProxyMessagePacket} from "../base-proxy";
import {EventEmitter} from "events";

/**
 * Receiving Cases:
 *
 * Injected -> Background (Passing through content)
 * Injected -> Content
 *
 * Background -> Injected (Passing through content)
 * Background -> Content
 *
 * Sending Cases:
 *
 * Content -> Injected
 * Content -> Background
 *
 */

export class ContentMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    window.addEventListener("message", this.receiveProxiedMessageFromInjected.bind(this));
    chrome.runtime.onMessage.addListener(this.receiveProxiedMessageFromBackground.bind(this));
  }

  private abstractEmitProxiedMessage(
      from: ProxyEventSource,
      to: ProxyEventSource,
      type: string,
      data: any
  ): void {

    const messagePacket: ProxyMessagePacket<any> = {
      from: from,
      to: to,
      type: type,
      data: data
    }

    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        throw new Error("Content cannot emit messages to itself!");
      case ProxyEventSource.BACKGROUND:
        chrome.runtime.sendMessage(messagePacket).catch((e) => console.error("Failed Content -> Background!", e));
        break;
      case ProxyEventSource.INJECTED:
        window.postMessage(messagePacket, "*");
        break;
      default:
        throw new Error(`Unknown event target "${messagePacket.to}"!`);
    }

  }

  emit(event: string, to: ProxyEventSource, data: any): boolean {
    this.abstractEmitProxiedMessage(ProxyEventSource.CONTENT, to, event, data);
    return true;
  }

  receiveProxiedMessageFromInjected(event: MessageEvent) {
    const messagePacket = event.data as ProxyMessagePacket<any>;

    // Only accept messages from the injected script
    if (messagePacket.from != ProxyEventSource.INJECTED) {
      return;
    }

    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
        break;
      case ProxyEventSource.BACKGROUND:
        this.abstractEmitProxiedMessage(messagePacket.from, messagePacket.to, messagePacket.type, messagePacket.data);
        break;
      default:
        throw new Error(`Unsupported event source "${messagePacket.to}"!`);
    }

  }

  receiveProxiedMessageFromBackground(messagePacket: ProxyMessagePacket<any>) {

    switch (messagePacket.to) {
      case ProxyEventSource.CONTENT:
        EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
        break;
      case ProxyEventSource.INJECTED:
        this.abstractEmitProxiedMessage(messagePacket.from, messagePacket.to, messagePacket.type, messagePacket);
        break;
      default:
        throw new Error(`Unsupported event target \"${messagePacket.to}\"!`);
    }
  }

  onUnmount() {
    window.removeEventListener("message", this.receiveProxiedMessageFromInjected.bind(this));
    chrome.runtime.onMessage.removeListener(this.receiveProxiedMessageFromBackground.bind(this));
  }

}


