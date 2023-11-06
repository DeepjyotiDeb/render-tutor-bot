import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  PALM='models/chat-bison-001'
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  PALM='Palm Model'
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.PALM]:{
    id: PluginID.PALM,
    name: PluginName.PALM,
    requiredKeys: [{key: 'PALM_API_KEY', value: ''}]
  }
};

export const PluginList = Object.values(Plugins);
