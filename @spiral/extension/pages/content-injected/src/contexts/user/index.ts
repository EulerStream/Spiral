import {SpiralWebSocketManager} from "@src/contexts/user/lib/manager";
import {SpiralBroker} from "@src/contexts/user/lib/broker";
import { ProxyEventSource } from "@extension/message-proxy/lib/base-proxy";

export function userContextScript() {

  const Spiral = document.__Spiral__ = {
    ...document.__Spiral__,
    Manager: new SpiralWebSocketManager(),
    Broker: new SpiralBroker()
  };

  (function () {
    const WebSocketOriginal = window.WebSocket;

    /**
     * Intercepted WebSocket constructor
     *
     * @param url {string} - WebSocket
     * @param protocols - WebSocket protocols
     * @returns {*} - WebSocket instance
     * @constructor - WebSocket
     */
    function interceptedWebSocket(url: string, protocols: string | string[]): WebSocket {
      const webSocket = new WebSocketOriginal(url, protocols);
      const originalSend = webSocket.send;
      webSocket.onsend = () => null;
      webSocket.onopen = () => document.__Spiral__.Manager.add(webSocket);
      webSocket.send = (data: any) => {
        webSocket.onsend(data);
        const isOpen = webSocket.readyState === WebSocketOriginal.OPEN;
        if (isOpen) return originalSend.call(webSocket, data);
      }
      return webSocket;
    }

    window.WebSocket = interceptedWebSocket as any;
    window.WebSocket.prototype = WebSocketOriginal.prototype;

  })();

  const sendMessageChange = () => Spiral.MessageProxy.emit('tiktok-page-change', ProxyEventSource.CONTENT, {url: window.location.href});

  /** Send a message to the content script when the page changes **/
  (function () {
    window.addEventListener('popstate', sendMessageChange);
    Spiral.MessageProxy.on('content-ui-loaded', sendMessageChange);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args: Parameters<typeof originalPushState>) {
      originalPushState.apply(this, args);
      sendMessageChange();
    }

    window.history.replaceState = function (...args: Parameters<typeof originalReplaceState>) {
      originalReplaceState.apply(this, args);
      sendMessageChange();
    }

  })();

  (function () {
    const data = document.getElementById("__UNIVERSAL_DATA_FOR_REHYDRATION__");
    if (data) {
      const parsedData = JSON.parse(data.textContent || "{}");
      const userData = parsedData?.['__DEFAULT_SCOPE__']?.['webapp.app-context']?.['user'];
      Spiral.MessageProxy.emit('user-profile-data', ProxyEventSource.BACKGROUND, userData);
    }
  })()

}