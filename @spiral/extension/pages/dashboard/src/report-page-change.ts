import {ProxyEventSource} from "@extension/message-proxy/lib/base-proxy";
import Logger from "@extension/shared/lib/logger";
import {BackgroundMessageProxy} from "@extension/message-proxy/lib";


/** Send a message to the content script when the page changes **/
export function reportPageChange() {
  Logger.info('Page changes will be reported...');

  window.addEventListener('hashchange', () => {
    console.log('Sending message...');
    const messageProxy = new BackgroundMessageProxy();
    try {
      messageProxy.emit('dashboard-page-change', ProxyEventSource.INJECTED, {url: window.location.href}, ["*://localhost/*", "*://*.spiral.eulerstream.com/*"]);
    console.log('Sent message!')
    } catch (e) {
      console.log('Failed to send message:', e)
    }
  });

}