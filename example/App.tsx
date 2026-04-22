import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

import UsageStats, {
  UsageIntervalType,
  UsageEventType,
} from "@antardev/react-native-usage-stats";

/**
 * This example demonstrates how to use the
 * react-native-usage-stats package.
 *
 * It is intentionally simple and focuses on:
 * - Permission handling
 * - Querying usage stats
 * - Querying events
 * - Understanding time ranges and intervals
 */

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>UsageStats Example (Android Only)</Text>

        {/* ---------------- PERMISSIONS ---------------- */}

        <Group name="Permissions">
          <Button
            title="Check / Request Permission"
            onPress={() => {
              const granted = UsageStats.isPermissionGranted();

              if (!granted) {
                // Opens system settings for usage access
                UsageStats.requestPermission();
                return;
              }

              alert("Permission already granted");
            }}
          />
        </Group>

        {/* ---------------- USAGE STATS ---------------- */}

        <Group name="Usage Stats (Top Apps)">
          <Button
            title="Top Apps (Last 24h)"
            onPress={async () => {
              const { start, end } = getRange("24h");

              const data = await UsageStats.queryUsageStats({
                startTime: start,
                endTime: end,
                interval: UsageIntervalType.INTERVAL_DAILY,
              });

              if (!data.length) {
                alert("No usage data found");
                return;
              }

              // Sort by usage time
              const sorted = data
                .sort(
                  (a, b) => b.totalTimeInForeground - a.totalTimeInForeground,
                )
                .slice(0, 5);

              console.log("Top Apps:", sorted);

              alert(
                sorted
                  .map(
                    (app) =>
                      `${app.packageName}\n${Math.floor(
                        app.totalTimeInForeground / 1000,
                      )} sec`,
                  )
                  .join("\n\n"),
              );
            }}
          />
        </Group>

        {/* ---------------- EVENTS ---------------- */}

        <Group name="Events">
          <Button
            title="Get Events (Last 1h)"
            onPress={async () => {
              const { start, end } = getRange("1h");

              const events = await UsageStats.queryEvents({
                startTime: start,
                endTime: end,
              });

              console.log("Events:", events);

              alert(`Events count: ${events.length}`);
            }}
          />

          <Button
            title="Current Foreground App"
            onPress={async () => {
              const { start, end } = getRange("1h");

              const events = await UsageStats.queryEvents({
                startTime: start,
                endTime: end,
              });

              const app = getCurrentApp(events);

              alert(`Current App: ${app}`);
            }}
          />
        </Group>

        {/* ---------------- EVENT STATS ---------------- */}

        <Group name="Event Stats">
          <Button
            title="Event Stats (Last 24h)"
            onPress={async () => {
              const { start, end } = getRange("24h");

              const stats = await UsageStats.queryEventStats({
                startTime: start,
                endTime: end,
                interval: UsageIntervalType.INTERVAL_DAILY,
              });

              console.log("EventStats:", stats);

              alert(`Event types: ${stats.length}`);
            }}
          />
        </Group>

        {/* ---------------- AGGREGATE ---------------- */}

        <Group name="Aggregate Usage">
          <Button
            title="Aggregate Stats (Last 24h)"
            onPress={async () => {
              const { start, end } = getRange("24h");

              const data = await UsageStats.queryAndAggregateUsageStats({
                startTime: start,
                endTime: end,
              });

              console.log("Aggregate:", data);

              alert(`Apps: ${Object.keys(data).length}`);
            }}
          />
        </Group>

        {/* ---------------- CONFIG ---------------- */}

        <Group name="Configurations">
          <Button
            title="Get Config Changes"
            onPress={async () => {
              const { start, end } = getRange("24h");

              const data = await UsageStats.queryConfigurations({
                startTime: start,
                endTime: end,
                interval: UsageIntervalType.INTERVAL_DAILY,
              });

              console.log("Configs:", data);

              alert(`Configs: ${data.length}`);
            }}
          />
        </Group>

        {/* ---------------- SELF EVENTS ---------------- */}

        <Group name="Self Events">
          <Button
            title="Events For This App"
            onPress={async () => {
              const { start, end } = getRange("1h");

              const data = await UsageStats.queryEventsForSelf({
                startTime: start,
                endTime: end,
              });

              console.log("Self Events:", data);

              alert(`Self events: ${data.length}`);
            }}
          />
        </Group>

        {/* ---------------- APP STATE ---------------- */}

        <Group name="App State">
          <Button
            title="Is Chrome Inactive?"
            onPress={async () => {
              const result =
                await UsageStats.isAppInactive("com.android.chrome");

              alert(`Chrome inactive: ${result}`);
            }}
          />

          <Button
            title="My Standby Bucket"
            onPress={async () => {
              const bucket = await UsageStats.getAppStandbyBucket();

              alert(`Bucket: ${bucket}`);
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- HELPERS ---------------- */

/**
 * Returns a time range for queries
 */
function getRange(type: "1h" | "24h" | "7d") {
  const now = Date.now();

  switch (type) {
    case "1h":
      return { start: now - 60 * 60 * 1000, end: now };
    case "24h":
      return { start: now - 24 * 60 * 60 * 1000, end: now };
    case "7d":
      return { start: now - 7 * 24 * 60 * 60 * 1000, end: now };
  }
}

/**
 * Finds the most recent foreground app from events
 */
function getCurrentApp(events: any[]) {
  const sorted = [...events].sort((a, b) => b.timeStamp - a.timeStamp);

  const last = sorted.find(
    (e) => e.eventType === UsageEventType.ACTIVITY_RESUMED,
  );

  return last?.packageName || "Unknown";
}

/* ---------------- UI ---------------- */

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 26,
    margin: 20,
  },
  groupHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
};
