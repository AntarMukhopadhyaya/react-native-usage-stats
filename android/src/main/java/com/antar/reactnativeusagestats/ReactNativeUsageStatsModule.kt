package com.antar.reactnativeusagestats

import android.app.AppOpsManager
import android.content.Context
import android.os.Process
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Intent
import android.provider.Settings
import android.app.usage.UsageStatsManager
import android.app.usage.UsageEvents
import android.app.usage.ConfigurationStats
import android.os.PersistableBundle
import android.app.usage.EventStats

class ReactNativeUsageStatsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ReactNativeUsageStats")

    Function("isPermissionGranted") {
      val context = appContext.reactContext ?: return@Function false

      val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager

      val mode = appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
      )

      mode == AppOpsManager.MODE_ALLOWED
    }
    Function("requestPermission"){
      val context = appContext.reactContext ?: return@Function null
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      null
    }
    AsyncFunction("queryUsageStats"){startTime: Double, endTime: Double, interval: Int ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats = usageStatsManager.queryUsageStats(
        interval,
        startTime.toLong(),
        endTime.toLong()
      )
      return@AsyncFunction stats?.map {
          mapOf(
            "packageName" to it.packageName,
            "firstTimeStamp" to it.firstTimeStamp,
            "lastTimeStamp" to it.lastTimeStamp,
            "lastTimeUsed" to it.lastTimeUsed,
            "lastTimeVisible" to it.lastTimeVisible,
            "lastTimeForegroundServiceUsed" to it.lastTimeForegroundServiceUsed,
            "totalTimeInForeground" to it.totalTimeInForeground,
            "totalTimeVisible" to it.totalTimeVisible,
            "totalTimeForegroundServiceUsed" to it.totalTimeForegroundServiceUsed
          )
        } ?: emptyList()
    }
    AsyncFunction("queryEvents"){startTime: Double, endTime: Double ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val events = usageStatsManager.queryEvents(
        startTime.toLong(),
        endTime.toLong()
      )
      val event = UsageEvents.Event()
      val result = mutableListOf<Map<String, Any>>()
      while(events.hasNextEvent()){
        events.getNextEvent(event)
        val extras: PersistableBundle? = event.extras
        val safeExtras = extras
          ?.keySet()
          ?.associateWith { key -> extras.get(key) ?: "" }
          ?: emptyMap<String, Any>()
        result.add(
            mapOf(
                "packageName" to event.packageName,
                "className" to (event.className ?: ""),
                "timeStamp" to event.timeStamp,
                "eventType" to event.eventType,
                "standbyBucket" to event.appStandbyBucket,
                "shortcutId" to (event.shortcutId ?: ""),
                "extras" to safeExtras
            )
        )
      }
      return@AsyncFunction result
    }
    AsyncFunction("queryEventStats") { startTime: Double, endTime: Double, interval: Int ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()

      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

      val stats = usm.queryEventStats(
        interval,
        startTime.toLong(),
        endTime.toLong()
      )

      return@AsyncFunction stats?.map {
        mapOf(
          "eventType" to it.eventType,
          "count" to it.count,
          "totalTime" to it.totalTime,
          "lastEventTime" to it.lastEventTime,
          "firstTimeStamp" to it.firstTimeStamp,
          "lastTimeStamp" to it.lastTimeStamp
        )
      } ?: emptyList()
    }
    AsyncFunction("queryAndAggregateUsageStats"){startTime: Double, endTime: Double ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyMap<String,Any>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats = usageStatsManager.queryAndAggregateUsageStats(
        startTime.toLong(),
        endTime.toLong()
      )
      return@AsyncFunction stats.mapValues{(_,value) ->
        mapOf(
          "firstTimeStamp" to value.firstTimeStamp,
          "lastTimeStamp" to value.lastTimeStamp,
          "lastTimeUsed" to value.lastTimeUsed,
          "lastTimeVisible" to value.lastTimeVisible,
          "lastTimeForegroundServiceUsed" to value.lastTimeForegroundServiceUsed,
          "totalTimeInForeground" to value.totalTimeInForeground,
          "totalTimeVisible" to value.totalTimeVisible,
          "totalTimeForegroundServiceUsed" to value.totalTimeForegroundServiceUsed
        )
      }
    }
    AsyncFunction("queryConfigurations") { startTime: Double, endTime: Double, interval: Int ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()

      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

      val configs = usm.queryConfigurations(
        interval,
        startTime.toLong(),
        endTime.toLong()
      )

      return@AsyncFunction configs.map {
        mapOf(
          "firstTimeStamp" to it.firstTimeStamp,
          "lastTimeStamp" to it.lastTimeStamp,
          "lastTimeActive" to it.lastTimeActive
        )
      }
    }
    AsyncFunction("queryEventsForSelf") {startTime: Double, endTime: Double ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val events = usageStatsManager.queryEventsForSelf(
        startTime.toLong(),
        endTime.toLong()
      ) ?: return@AsyncFunction emptyList<Map<String, Any>>()
      val event = UsageEvents.Event()
      val result = mutableListOf<Map<String, Any>>()
      while(events.hasNextEvent()){
        events.getNextEvent(event)
        val extras:PersistableBundle? = event.extras
        val safeExtras = extras
        ?.keySet()
        ?.associateWith { key -> extras.get(key) ?: "" }
        ?: emptyMap<String, Any>()
        result.add(
            mapOf(
                "packageName" to event.packageName,
                "className" to (event.className ?: ""),
                "timeStamp" to event.timeStamp,
                "eventType" to event.eventType,
                "standbyBucket" to event.appStandbyBucket,
                "shortcutId" to (event.shortcutId ?: ""),
                "extras" to safeExtras

            )
        )
      }
      return@AsyncFunction result
    }
    AsyncFunction("isAppInactive"){packageName: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      return@AsyncFunction usageStatsManager.isAppInactive(packageName)
    }
    AsyncFunction("getAppStandbyBucket"){
      val context = appContext.reactContext ?: return@AsyncFunction -1
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      return@AsyncFunction usageStatsManager.getAppStandbyBucket()
    }
  }
}
