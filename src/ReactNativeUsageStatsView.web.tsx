import * as React from 'react';

import { ReactNativeUsageStatsViewProps } from './ReactNativeUsageStats.types';

export default function ReactNativeUsageStatsView(props: ReactNativeUsageStatsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
