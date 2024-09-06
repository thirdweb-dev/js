"use state";

import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { useState } from "react";
import { TabButtons } from "../../@/components/ui/tabs";
import { AccountFactories } from "./AccountFactories";
import { SponsorshipPolicies } from "./SponsorshipPolicies";

interface SmartWalletsProps {
  apiKey: ApiKey;
  trackingCategory: string;
  defaultTabIndex?: number;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  apiKey,
  trackingCategory,
  defaultTabIndex,
}) => {
  const [selectedTab, setSelectedTab] = useState<"factories" | "config">(
    defaultTabIndex === 1 ? "config" : "factories",
  );

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Account Factories",
            onClick: () => setSelectedTab("factories"),
            isActive: selectedTab === "factories",
            isEnabled: true,
          },
          {
            name: "Configuration",
            onClick: () => setSelectedTab("config"),
            isActive: selectedTab === "config",
            isEnabled: true,
          },
        ]}
      />

      <div className="h-6" />

      {selectedTab === "factories" && (
        <AccountFactories trackingCategory={trackingCategory} />
      )}

      {selectedTab === "config" && (
        <SponsorshipPolicies
          apiKey={apiKey}
          trackingCategory={trackingCategory}
        />
      )}
    </div>
  );
};
