import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeUsageStatsViewProps } from './ReactNativeUsageStats.types';

const NativeView: React.ComponentType<ReactNativeUsageStatsViewProps> =
  requireNativeView('ReactNativeUsageStats');

export default function ReactNativeUsageStatsView(props: ReactNativeUsageStatsViewProps) {
  return <NativeView {...props} />;
}
