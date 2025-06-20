"use client";

import { useState } from "react";
import { TabButtons } from "@/components/ui/tabs";

type TabKey = "ts" | "react" | "react-native" | "dotnet" | "unity" | "unreal";

const tabNames: Record<TabKey, string> = {
  dotnet: ".NET",
  react: "React",
  "react-native": "React Native",
  ts: "TypeScript",
  unity: "Unity",
  unreal: "Unreal Engine",
};

export function IntegrateAPIKeyCodeTabs(props: {
  tabs: Record<TabKey, React.ReactNode>;
}) {
  const [tab, setTab] = useState<TabKey>("ts");

  return (
    <div>
      <TabButtons
        tabClassName="!text-sm"
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
