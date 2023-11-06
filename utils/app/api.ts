import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }
  if(plugin.id === PluginID.PALM){
    return 'api/palm';
  }

  return 'api/chat';
};
