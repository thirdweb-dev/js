"use client";

import { TabButtons } from "@/components/ui/tabs";
import type { ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import { useState } from "react";
import { AccountFactories } from "./AccountFactories";
import { AccountAbstractionSettingsPage } from "./SponsorshipPolicies";

interface SmartWalletsProps {
  apiKeyServices: ApiKeyService[];
  trackingCategory: string;
  defaultTab: 0 | 1;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  apiKeyServices,
  trackingCategory,
  defaultTab,
}) => {
  const [selectedTab, setSelectedTab] = useState<"factories" | "config">(
    defaultTab === 0 ? "config" : "factories",
  );

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Sponsorship Policies",
            onClick: () => setSelectedTab("config"),
            isActive: selectedTab === "config",
            isEnabled: true,
          },
          {
            name: "Account Factories",
            onClick: () => setSelectedTab("factories"),
            isActive: selectedTab === "factories",
            isEnabled: true,
          },
        ]}
      />

      <div className="h-6" />

      {selectedTab === "factories" && (
        <AccountFactories trackingCategory={trackingCategory} />
      )}

      {selectedTab === "config" && (
        <AccountAbstractionSettingsPage
          apiKeyServices={apiKeyServices}
          trackingCategory={trackingCategory}
        />
      )}
    </div>
  );
};
