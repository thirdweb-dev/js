"use client";

import { TabButtons } from "@/components/ui/tabs";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { InAppWalletSettingsPage } from "./Configure";
import { InAppWalletUsersPageContent } from "./Users";

interface EmbeddedWalletsProps {
  apiKey: Pick<
    ApiKey,
    | "id"
    | "name"
    | "domains"
    | "bundleIds"
    | "services"
    | "redirectUrls"
    | "key"
  >;
  trackingCategory: string;
}

export const EmbeddedWallets: React.FC<EmbeddedWalletsProps> = ({
  apiKey,
  trackingCategory,
}) => {
  const searchParams = useSearchParams();
  const defaultTabIndex = searchParams?.get("tab") === "1" ? 1 : 0;
  const [selectedTab, setSelectedTab] = useState<"users" | "config">(
    defaultTabIndex === 0 ? "users" : "config",
  );

  function updateSearchParams(value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState(null, "", url.toString());
  }

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Users",
            onClick: () => {
              setSelectedTab("users");
              updateSearchParams("0");
            },
            isActive: selectedTab === "users",
            isEnabled: true,
          },
          {
            name: "Configuration",
            onClick: () => {
              setSelectedTab("config");
              updateSearchParams("1");
            },
            isActive: selectedTab === "config",
            isEnabled: true,
          },
        ]}
      />

      <div className="h-6" />

      {selectedTab === "users" && (
        <InAppWalletUsersPageContent
          clientId={apiKey.key}
          trackingCategory={trackingCategory}
        />
      )}

      {selectedTab === "config" && (
        <InAppWalletSettingsPage
          apiKey={apiKey}
          trackingCategory={trackingCategory}
        />
      )}
    </div>
  );
};
