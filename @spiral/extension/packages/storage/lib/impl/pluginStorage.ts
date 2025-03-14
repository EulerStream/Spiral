import {StorageEnum} from '../base/enums';
import {createStorage} from '../base/base';
import type {BaseStorage} from '../base/types';

type StoredPlugin = {
  script: string;
  enabled: boolean;
  manifest: Record<string, string>
}

type PluginMap = Record<string, StoredPlugin>;

type PluginStorage = BaseStorage<PluginMap> & {
  setPlugin: (pluginId: string, plugin: StoredPlugin) => Promise<void>;
  removePlugin: (pluginId: string) => Promise<void>;
  setPluginEnabled: (pluginId: string, enabled: boolean) => Promise<void>;
  setPluginDisabled: (pluginId: string) => Promise<void>;
  getPlugin: (pluginId: string) => Promise<StoredPlugin | undefined>;
  hasPlugin: (pluginId: string) => Promise<boolean>;
}

const storage = createStorage<PluginMap>('spiral-plugins', {}, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const pluginStorage: PluginStorage = {
  ...storage,
  setPlugin: async (pluginId, plugin) => {
    const plugins = await storage.get();
    plugins[pluginId] = plugin;
    await storage.set(plugins);
  },

  removePlugin: async (pluginId) => {
    const plugins = await storage.get();
    delete plugins[pluginId];
    await storage.set(plugins);
  },

  setPluginEnabled: async (pluginId, enabled) => {
    const plugins = await storage.get();
    plugins[pluginId].enabled = enabled;
    await storage.set(plugins);
  },

  setPluginDisabled: async (pluginId) => {
    const plugins = await storage.get();
    plugins[pluginId].enabled = false;
    await storage.set(plugins);
  },

  getPlugin: async (pluginId) => {
    const plugins = await storage.get();
    return plugins[pluginId];
  },

  hasPlugin: async (pluginId) => {
    const plugins = await storage.get();
    return !!plugins[pluginId];
  }

};
