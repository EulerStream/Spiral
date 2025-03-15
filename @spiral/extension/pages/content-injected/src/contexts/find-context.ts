import {userContextScript} from "@src/contexts/user";
import {embedContextScript} from "@src/contexts/embed";
import Logger from "@extension/shared/dist/lib/logger";
import {websiteContextScript} from "@src/contexts/website";

// Pattern matches tiktok.com/live or tiktok.com/@username/live with any query params or none
const TikTokLiveRegex = /tiktok\.com\/(?:live|@[^\/]+\/live)(?:\?.*)?/;

// Pattern matches localhost:3000/dashboard OR spiral.eulerstream.com/dashboard with ANYTHING after
const WebsiteRegex = /(?:localhost:3000|spiral\.eulerstream\.com)\/dashboard(?:\/.*)?/;

export function getContextScript(): CallableFunction | void {
  const url = new URL(window.location.href);

  // Embed the video stream
  if ((url.searchParams.get("spiral-embedded-stream-video") || "-1") === "1") {
    Logger.info('Loading EMBED Context Script');
    return embedContextScript;
  }

  if (TikTokLiveRegex.test(url.href)) {
    Logger.info('Loading USER Context Script');
    return userContextScript;
  }

  if (WebsiteRegex.test(url.href)) {
    Logger.info('Loading WEBSITE Context Script');
    return websiteContextScript;
  }

  return;

}