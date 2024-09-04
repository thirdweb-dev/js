"use client";

import {} from "@/components/ui/select";
import { TabButtons } from "@/components/ui/tabs";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { PayConfig } from "components/pay/PayConfig";
import { useState } from "react";
import { WebhooksPage } from "../../../../../(dashboard)/dashboard/connect/pay/components/webhooks.client";

export function PayPageUI(props: {
  apiKey: Pick<
    ApiKey,
    | "key"
    | "services"
    | "id"
    | "name"
    | "domains"
    | "bundleIds"
    | "services"
    | "redirectUrls"
  >;
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
            {
              name: "Settings",
              isActive: activeTab === "settings",
              onClick: () => setActiveTab("settings"),
              isEnabled: true,
            },
          ]}
        />
      </div>

      {/* TODO: split this into sub-pages */}
      {activeTab === "analytics" && (
        <PayAnalytics clientId={props.apiKey.key} />
      )}
      {activeTab === "settings" && <PayConfig apiKey={props.apiKey} />}
      {activeTab === "webhooks" && <WebhooksPage clientId={props.apiKey.key} />}
    </>
  );
}
