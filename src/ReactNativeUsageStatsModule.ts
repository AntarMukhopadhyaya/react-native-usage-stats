import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativeUsageStatsModuleEvents } from './ReactNativeUsageStats.types';

declare class ReactNativeUsageStatsModule extends NativeModule<ReactNativeUsageStatsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeUsageStatsModule>('ReactNativeUsageStats');
