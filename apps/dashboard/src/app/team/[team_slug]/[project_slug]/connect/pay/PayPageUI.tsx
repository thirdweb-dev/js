"use client";

import { TabButtons } from "@/components/ui/tabs";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { useState } from "react";
import { WebhooksPage } from "../../../../../(dashboard)/dashboard/connect/pay/components/webhooks.client";

export function PayPageUI(props: {
  clientId: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "settings" | "analytics" | "webhooks"
  >("analytics");

  return (
    <>
      <div className="flex-col gap-4 flex lg:flex-row w-full relative">
        <TabButtons
          containerClassName="w-full"
          tabs={[
            {
              name: "Analytics",
              isActive: activeTab === "analytics",
              onClick: () => setActiveTab("analytics"),
              isEnabled: true,
            },
            {
              name: "Webhooks",
              isActive: activeTab === "webhooks",
              onClick: () => setActiveTab("webhooks"),
              isEnabled: true,
            },
          ]}
        />
      </div>

      {/* TODO: split this into sub-pages */}
      {activeTab === "analytics" && <PayAnalytics clientId={props.clientId} />}
      {activeTab === "webhooks" && <WebhooksPage clientId={props.clientId} />}
    </>
  );
}
