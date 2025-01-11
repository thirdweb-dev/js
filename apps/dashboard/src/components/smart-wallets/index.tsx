"use client";

import { TabLinks } from "@/components/ui/tabs";
import { useUserOpUsageAggregate } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountAbstractionAnalytics } from "./AccountAbstractionAnalytics";
import { AccountAbstractionSummary } from "./AccountAbstractionAnalytics/AccountAbstractionSummary";
import { AccountFactories } from "./AccountFactories";

interface SmartWalletsProps {
  trackingCategory: string;
  clientId: string;
  smartWalletsLayoutSlug: string;
  tab?: string;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  trackingCategory,
  clientId,
  smartWalletsLayoutSlug,
  tab = "analytics",
}) => {
  const aggregateUserOpUsageQuery = useUserOpUsageAggregate({
    clientId,
  });

  return (
    <div>
      <AccountAbstractionSummary
        aggregateUserOpUsageQuery={aggregateUserOpUsageQuery.data}
      />

      <div className="h-12" />

      <TabLinks
        links={[
          {
            name: "Analytics",
            href: `${smartWalletsLayoutSlug}?tab=analytics`,
            isActive: tab === "analytics",
            isDisabled: false,
          },
          {
            name: "Account Factories",
            href: `${smartWalletsLayoutSlug}?tab=factories`,
            isActive: tab === "factories",
            isDisabled: false,
          },
        ]}
      />

      <div className="h-6" />

      {tab === "analytics" && (
        <AccountAbstractionAnalytics clientId={clientId} />
      )}

      {tab === "factories" && (
        <AccountFactories trackingCategory={trackingCategory} />
      )}
    </div>
  );
};
