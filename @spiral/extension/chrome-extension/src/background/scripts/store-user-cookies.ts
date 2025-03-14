import {tiktokDataStorage} from "@extension/storage/lib/impl/";

export function AddStoreUserTikTokCookiesListener() {
  chrome.cookies.onChanged.addListener(async (changeInfo: chrome.cookies.CookieChangeInfo) => {
    if (changeInfo.cookie.domain != ".tiktok.com") {
      return;
    }

    await tiktokDataStorage.updateCookies({[changeInfo.cookie.name]: changeInfo.cookie.value});
  });
}

