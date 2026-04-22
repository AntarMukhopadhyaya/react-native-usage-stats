import { requireNativeModule } from "expo";
import {
  AppUsage,
  ConfigurationStat,
  EventStat,
  TimeRange,
  UsageEvent,
  UsageInterval,
  UsageStatsMap,
} from "./types";

const NativeModule = requireNativeModule("ReactNativeUsageStats");

export const UsageStats = {
  isPermissionGranted: (): boolean => {
    return NativeModule.isPermissionGranted();
  },
  requestPermission: (): void => {
    NativeModule.requestPermission();
  },
  async queryUsageStats(
    params: TimeRange & { interval: UsageInterval },
  ): Promise<AppUsage[]> {
    return await NativeModule.queryUsageStats(
      params.startTime,
      params.endTime,
      params.interval,
    );
  },
  async queryEvents(params: TimeRange): Promise<UsageEvent[]> {
    return await NativeModule.queryEvents(params.startTime, params.endTime);
  },
  async queryEventStats(
    params: TimeRange & { interval: UsageInterval },
  ): Promise<EventStat[]> {
    return await NativeModule.queryEventStats(
      params.startTime,
      params.endTime,
      params.interval,
    );
  },
  async queryEventsForSelf(params: TimeRange): Promise<UsageEvent[]> {
    return await NativeModule.queryEventsForSelf(
      params.startTime,
      params.endTime,
    );
  },
  async queryAndAggregateUsageStats(params: TimeRange): Promise<UsageStatsMap> {
    return await NativeModule.queryAndAggregateUsageStats(
      params.startTime,
      params.endTime,
    );
  },
  async queryConfigurations(
    params: TimeRange & { interval: UsageInterval },
  ): Promise<ConfigurationStat[]> {
    return await NativeModule.queryConfigurations(
      params.startTime,
      params.endTime,
      params.interval,
    );
  },

  async isAppInactive(packageName: string): Promise<boolean> {
    return await NativeModule.isAppInactive(packageName);
  },
  async getAppStandbyBucket(): Promise<number> {
    return await NativeModule.getAppStandbyBucket();
  },
};

export default UsageStats;
export * from "./types";
export { UsageIntervalType, UsageEventType } from "./types";
