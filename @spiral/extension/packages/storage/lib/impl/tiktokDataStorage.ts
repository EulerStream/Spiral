import {StorageEnum} from '../base/enums';
import {createStorage} from '../base/base';
import type {BaseStorage} from '../base/types';

export interface TikTokCookies {
  [key: string]: string | undefined;

  ttwid: string | undefined;
  sessionid: string | undefined;
}

export interface TikTokProfileData {
  [key: string]: any;

  avatarUri: string[]
  nickName: string,
  uniqueId: string,
  uid: string,
  isPrivateAccount: boolean,
}

type StoredTikTokData = {
  cookies: Partial<TikTokCookies>;
  profile: TikTokProfileData | undefined;
}

type TiktokDataStorage = BaseStorage<StoredTikTokData> & {
  updateCookies: (cookies: Partial<TikTokCookies>) => Promise<void>;
  setProfileData: (profile: TikTokProfileData) => Promise<void>;
};

const storage = createStorage<StoredTikTokData>('tiktok-data-stored', {cookies: {}, profile: undefined}, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});


// You can extend it with your own methods
export const tiktokDataStorage: TiktokDataStorage = {
  ...storage,
  updateCookies: async (cookies: Partial<TikTokCookies>) => {
    await storage.set((data) => ({...data, ...{...data.cookies, ...cookies}}));
  },
  setProfileData: async (profile: TikTokProfileData) => {
    await storage.set((data) => ({...data, profile}));
  }
};
