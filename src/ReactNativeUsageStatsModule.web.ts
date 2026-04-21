import { registerWebModule, NativeModule } from 'expo';

import { ReactNativeUsageStatsModuleEvents } from './ReactNativeUsageStats.types';

class ReactNativeUsageStatsModule extends NativeModule<ReactNativeUsageStatsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeUsageStatsModule, 'ReactNativeUsageStatsModule');
