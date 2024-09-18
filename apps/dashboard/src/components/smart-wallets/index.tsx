"use state";

import { TabButtons } from "@/components/ui/tabs";
import type { ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AccountFactories } from "./AccountFactories";
import { AccountAbstractionSettingsPage } from "./SponsorshipPolicies";

interface SmartWalletsProps {
  apiKeyServices: ApiKeyService[];
  trackingCategory: string;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  apiKeyServices,
  trackingCategory,
}) => {
  const searchParams = useSearchParams();
  const defaultTabIndex = Number.parseInt(searchParams?.get("tab") || "0");
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
        <AccountAbstractionSettingsPage
          apiKeyServices={apiKeyServices}
          trackingCategory={trackingCategory}
        />
      )}
    </div>
  );
};
