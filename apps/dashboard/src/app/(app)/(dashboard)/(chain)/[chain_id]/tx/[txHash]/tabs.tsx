"use client";
import { useState } from "react";
import { TabButtons } from "@/components/ui/tabs";

export function BridgeAndOverviewTabs(props: {
  bridgeStatus: React.ReactNode;
  overview: React.ReactNode;
}) {
  const [tab, setTab] = useState<"bridge" | "overview">("bridge");
  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Bridge",
            onClick: () => setTab("bridge"),
            isActive: tab === "bridge",
          },
          {
            name: "Overview",
            onClick: () => setTab("overview"),
            isActive: tab === "overview",
          },
        ]}
      />
      <div className="h-3" />
      {tab === "bridge" && props.bridgeStatus}
      {tab === "overview" && props.overview}
    </div>
  );
}
