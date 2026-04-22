export type AppUsage = {
  packageName: string;
  firstTimeStamp: number;
  lastTimeStamp: number;
  lastTimeUsed: number;
  lastTimeVisible: number;
  lastTimeForegroundServiceUsed: number;
  totalTimeInForeground: number;
  totalTimeVisible: number;
  totalTimeForegroundServiceUsed: number;
};
export type UsageEvent = {
  packageName: string;
  eventType: UsageEventTypeValue;
  timeStamp: number;
  className?: string;
  standbyBucket?: number;
  shortcutId?: string;
  extras?: Record<string, unknown>;
};
export type UsageEventTypeValue =
  (typeof UsageEventType)[keyof typeof UsageEventType];
export type EventStat = {
  eventType: UsageEventTypeValue;
  count: number;
  totalTime: number;
  lastEventTime: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
};
export type UsageStatsMap = Record<string, AppUsage>;
export type ConfigurationStat = {
  firstTimeStamp: number;
  lastTimeStamp: number;
  lastTimeActive: number;
};
export type UsageInterval =
  (typeof UsageIntervalType)[keyof typeof UsageIntervalType];
export type TimeRange = {
  startTime: number;
  endTime: number;
};

export const UsageIntervalType = {
  INTERVAL_DAILY: 0,
  INTERVAL_WEEKLY: 1,
  INTERVAL_MONTHLY: 2,
  INTERVAL_YEARLY: 3,
  INTERVAL_BEST: 4,
};

export const UsageEventType = {
  NONE: 0,

  ACTIVITY_RESUMED: 1,
  ACTIVITY_PAUSED: 2,
  ACTIVITY_STOPPED: 23,

  FOREGROUND_SERVICE_START: 19,
  FOREGROUND_SERVICE_STOP: 20,

  CONFIGURATION_CHANGE: 5,

  SCREEN_INTERACTIVE: 15,
  SCREEN_NON_INTERACTIVE: 16,

  KEYGUARD_SHOWN: 17,
  KEYGUARD_HIDDEN: 18,

  USER_INTERACTION: 7,
  SHORTCUT_INVOCATION: 8,

  STANDBY_BUCKET_CHANGED: 11,

  DEVICE_SHUTDOWN: 26,
  DEVICE_STARTUP: 27,
} as const;
