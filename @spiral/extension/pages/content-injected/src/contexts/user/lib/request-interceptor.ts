import {EventEmitter} from "events";

function interceptRequest(onResponse: (url: URL, data: Record<string, any>) => void | Promise<void>) {
  const originalFetch = window.fetch;

  /** Intercept the fetch API **/
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 200 && response.headers.get("content-type")?.includes("application/json")) {
      const responseClone = response.clone();
      const data = await responseClone.json();
      onResponse(new URL(responseClone.url), data);
    }

    return response; // Return the original response so it remains usable
  };

  /** Intercept the XMLHttpRequest API **/
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (_, url) {

    this.addEventListener("load", () => {
      if (this.responseType === "json") {
        onResponse(new URL(url), this.response);
      }
    });

    originalOpen.apply(this, arguments as any);
  };
}


class TikTokRequestInterceptor extends EventEmitter {

  constructor() {
    super();
    interceptRequest(this.onRequestResponse.bind(this));
  }

  private onRequestResponse(url: URL, data: Record<string, any>) {
    if (!url.hostname.endsWith('.tiktok.com')) {
      return;
    }

    this.emit(url.pathname, data);
  }

  on(path: string, listener: (response: any) => void | Promise<void>): this {
    return super.on(path, listener);
  }

}

export default new TikTokRequestInterceptor();