/**
 * Injects the inject.js script into the page
 */
import {ContentMessageProxy} from "@extension/message-proxy/dist/lib";

(async function () {
  const injectScript = document.createElement("script");
  injectScript.src = chrome.runtime.getURL("content/injected.iife.js");
  injectScript.onload = () => injectScript.remove();
  (document.head || document.documentElement).appendChild(injectScript);
})();

chrome.runtime.onMessage.addListener((message: any) => {

  if (message.type !== "update-ttwid") {
    return;
  }

  const root = document.getElementById('spiral')!;
  root.setAttribute('ttwid', message.data);

});

new ContentMessageProxy();
