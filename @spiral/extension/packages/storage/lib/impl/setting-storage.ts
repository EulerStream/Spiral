import {StorageEnum} from '../base/enums';
import {createStorage} from '../base/base';
import type {BaseStorage} from '../base/types';

export type StoredSettings = {
  agentEnabled: boolean;
  agentId: string;
  widgetDevMode: boolean;
  widgetDevUrl: string;
};

const DefaultSettings: StoredSettings = {
  agentEnabled: false,
  agentId: '',
  widgetDevMode: false,
  widgetDevUrl: 'http://127.0.0.1:5173',
};

type SettingStorage = BaseStorage<StoredSettings> & {
  updateSettings: (setting: Partial<StoredSettings>) => Promise<void>;
};

const storage = createStorage<StoredSettings>('app-settings', DefaultSettings, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const settingStorage: SettingStorage = {
  ...storage,
  updateSettings: async (setting: Partial<StoredSettings>) => {
    const current = await storage.get();
    await storage.set({...current, ...setting});
  }
};
