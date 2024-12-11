"use client";

import { TabLinks } from "@/components/ui/tabs";
import {
  type Account,
  type ApiKeyService,
  useUserOpUsageAggregate,
} from "@3rdweb-sdk/react/hooks/useApi";
import { AccountAbstractionAnalytics } from "./AccountAbstractionAnalytics";
import { AccountAbstractionSummary } from "./AccountAbstractionAnalytics/AccountAbstractionSummary";
import { AccountFactories } from "./AccountFactories";
import { AccountAbstractionSettingsPage } from "./SponsorshipPolicies";

interface SmartWalletsProps {
  apiKeyServices: ApiKeyService[];
  trackingCategory: string;
  clientId: string;
  smartWalletsLayoutSlug: string;
  tab?: string;
  twAccount: Account;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  apiKeyServices,
  trackingCategory,
  clientId,
  smartWalletsLayoutSlug,
  tab = "analytics",
  twAccount,
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
            name: "Sponsorship Policies",
            href: `${smartWalletsLayoutSlug}?tab=config`,
            isActive: tab === "config",
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

      {tab === "config" && (
        <AccountAbstractionSettingsPage
          apiKeyServices={apiKeyServices}
          trackingCategory={trackingCategory}
          twAccount={twAccount}
        />
      )}
    </div>
  );
};
