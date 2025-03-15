import {createRoot} from 'react-dom/client';
import App from './App';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';
import {ContentMessageProxy} from '@extension/message-proxy';
import {ProxyEventSource, ProxyMessagePacket} from '@extension/message-proxy/lib/base-proxy';
import SpiralLogo from './assets/SpiralLogo.png';
import {attemptNavButtonInjection} from "@src/scripts/nav-button-injection";


function injectSpiral(container: Element) {

  // Create root
  const root = document.createElement('div');
  root.id = 'spiral';

  if (chrome.runtime.getManifest().name.includes('Development')) {
    root.setAttribute('spiral-mode', 'development');
  } else {
    root.setAttribute('spiral-mode', 'production');
  }

  const appHeight = "60px";
  container.insertBefore(root, container.firstChild);
  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';
  rootIntoShadow.style.height = appHeight;
  const shadowRoot = root.attachShadow({mode: 'open'});

  const injectedCss = document.createElement("style")
  injectedCss.innerHTML = `
  div[class*='DivGiftRelatedContainer'] {
    margin-top: ${appHeight} !important;
  }
`;
  document.head.appendChild(injectedCss);

  if (navigator.userAgent.includes('Firefox')) {
    /**
     * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
     * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
     *
     * Injecting styles into the document, this may cause style conflicts with the host page
     */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = tailwindcssOutput;
    shadowRoot.appendChild(styleElement);
  } else {
    /** Inject styles into shadow dom */
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(tailwindcssOutput);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }

  shadowRoot.appendChild(rootIntoShadow);
  createRoot(rootIntoShadow).render(<App/>);
}


function attemptInjection(event?: ProxyMessagePacket<{ url: string }>) {
  const tiktokLiveRegex = /^https:\/\/www\.tiktok\.com\/@[^/]+\/live\/?(?:\?.*)?$/;
  const tiktokLiveMainRegex = /^https:\/\/www\.tiktok\.com\/live\/?(?:\?.*)?$/;

  if (!!document.getElementById('spiral')) {
    return;
  }

  let container: Element | null = null;

  // TikTok LIVE Homepage
  if (tiktokLiveMainRegex.test(event?.data?.url || window.location.href)) {
    container = document.querySelector('div[class*="DivScrollWrapper"]');
  }
  // TikTok LIVE Room
  else if (tiktokLiveRegex.test(event?.data?.url || window.location.href)) {
    container = document.querySelector('div[data-e2e="live-room-content"]')?.parentNode as Element ?? null;
  }

  if (!container) {
    return;
  }

  injectSpiral(container);
}

if (window.location.href.includes('tiktok.com')) {
  const messageProxy = new ContentMessageProxy();
  messageProxy.on("tiktok-page-change", attemptNavButtonInjection);
  messageProxy.emit('content-ui-loaded', ProxyEventSource.INJECTED, {});
  messageProxy.on("tiktok-page-change", attemptInjection);
  attemptInjection();
  attemptNavButtonInjection();
}