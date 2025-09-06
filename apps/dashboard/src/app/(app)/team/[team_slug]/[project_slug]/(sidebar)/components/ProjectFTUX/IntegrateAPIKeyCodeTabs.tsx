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
  tabs: Record<TabKey, React.ReactNode>;
}) {
  const [tab, setTab] = useState<TabKey>("api");

  return (
    <div>
      <TabButtons
        tabs={Object.entries(tabNames).map(([key, name]) => ({
          isActive: tab === key,
          name,
          onClick: () => setTab(key as TabKey),
        }))}
      />
      <div className="h-2" />
      {props.tabs[tab]}
    </div>
  );
}
