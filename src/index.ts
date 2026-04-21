// Reexport the native module. On web, it will be resolved to ReactNativeUsageStatsModule.web.ts
// and on native platforms to ReactNativeUsageStatsModule.ts
export { default } from './ReactNativeUsageStatsModule';
export { default as ReactNativeUsageStatsView } from './ReactNativeUsageStatsView';
export * from  './ReactNativeUsageStats.types';
