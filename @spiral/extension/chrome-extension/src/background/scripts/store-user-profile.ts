import {BackgroundMessageProxy} from "@extension/message-proxy/lib";
import {ProxyMessagePacket} from "@extension/message-proxy/lib/base-proxy";
import {tiktokDataStorage, TikTokProfileData} from "@extension/storage/lib";
import Logger from "@extension/shared/lib/logger";

export function AddStoreUserProfileListener(messageProxy: BackgroundMessageProxy) {
  messageProxy.on('user-profile-data', async (event: ProxyMessagePacket<TikTokProfileData>) => {
    Logger.info('Received user profile from TikTok');
    await tiktokDataStorage.setProfileData(event.data);
  });
}