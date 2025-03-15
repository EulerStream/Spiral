import {BaseMessageProxy, ProxyEventSource, ProxyMessagePacket} from "../base-proxy";
import {EventEmitter} from "events";
import Logger from "@extension/shared/dist/lib/logger";
import {matchHostnameToPatterns} from "../utilts";

export class BackgroundMessageProxy extends BaseMessageProxy {

  constructor() {
    super();
    chrome.runtime.onMessage.addListener(this.receiveProxiedMessage.bind(this));
    Logger.info('Loaded BackgroundMessageProxy');
  }

  emit(type: string, to: ProxyEventSource, data: any, specificHosts: string[] | undefined = undefined): boolean {
    const messagePacket: ProxyMessagePacket<any> = {
      from: ProxyEventSource.BACKGROUND,
      to: to,
      type: type,
      data: data
    }

    const allowedHosts = specificHosts || chrome.runtime.getManifest().host_permissions;

    // Send the message to all content scripts
    chrome.tabs.query({active: true}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id && tab.url && matchHostnameToPatterns(new URL(tab.url).hostname, allowedHosts)) {
          chrome.tabs.sendMessage(tab.id!, messagePacket).catch(console.error);
        }
      }
    });
    return true;
  }

  receiveProxiedMessage(messagePacket: ProxyMessagePacket<any>, sender: chrome.runtime.MessageSender) {

    // Sender MUST be ourself
    if (sender.id !== chrome.runtime.id) {
      return;
    }

    if (messagePacket.to !== ProxyEventSource.BACKGROUND) {
      throw new Error("Background can only receive messages intended for itself!");
    }

    EventEmitter.prototype.emit.call(this, messagePacket.type, messagePacket);
  }

  onUnmount() {
    chrome.runtime.onMessage.removeListener(this.receiveProxiedMessage.bind(this));
  }

}


