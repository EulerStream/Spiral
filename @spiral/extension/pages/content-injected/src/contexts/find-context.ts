import {userContextScript} from "@src/contexts/user";
import {embedContextScript} from "@src/contexts/embed";
import Logger from "@extension/shared/dist/lib/logger";

// Pattern matches tiktok.com/live or tiktok.com/@username/live with any query params or none
const TikTokLiveRegex = /tiktok\.com\/(?:live|@[^\/]+\/live)(?:\?.*)?/;

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

  return;

}