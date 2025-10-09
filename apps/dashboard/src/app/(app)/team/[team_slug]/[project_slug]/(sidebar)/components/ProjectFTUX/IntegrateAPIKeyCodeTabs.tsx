"use client";

import { useState } from "react";
import { TabButtons } from "@/components/ui/tabs";

type TabKey =
  | "ts"
  | "react"
  | "react-native"
  | "dotnet"
  | "unity"
  | "unreal"
  | "api"
  | "curl";

const tabNames: Record<TabKey, string> = {
  api: "API",
  ts: "TypeScript",
  react: "React",
  "react-native": "React Native",
  dotnet: ".NET",
  unity: "Unity",
  unreal: "Unreal Engine",
  curl: "cURL",
};

export function IntegrateAPIKeyCodeTabs(props: {
  tabs: Partial<Record<TabKey, React.ReactNode>>;
}) {
  const availableTabEntries = (
    Object.entries(tabNames) as Array<[TabKey, string]>
  ).filter(([key]) => props.tabs[key]);

  const [tab, setTab] = useState<TabKey>(availableTabEntries[0]?.[0] ?? "api");

  const activeTab = props.tabs[tab]
    ? tab
    : (availableTabEntries[0]?.[0] ?? "api");

  if (availableTabEntries.length === 0) {
    return null;
  }

  return (
    <div>
      <TabButtons
        tabs={availableTabEntries.map(([key, name]) => ({
          isActive: activeTab === key,
          name,
          onClick: () => setTab(key),
        }))}
      />
      <div className="h-2" />
      {props.tabs[activeTab]}
    </div>
  );
}
