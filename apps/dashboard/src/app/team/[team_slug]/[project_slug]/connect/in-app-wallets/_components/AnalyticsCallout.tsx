"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { UsageCard } from "components/settings/Account/UsageCard";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import { toNumber, toPercent } from "utils/number";

type AnalyticsCalloutProps = {
  trackingCategory: string;
};

export const AnalyticsCallout: React.FC<AnalyticsCalloutProps> = ({
  trackingCategory,
}) => {
  const usageQuery = useAccountUsage();

  const walletsMetrics = useMemo(() => {
    if (!usageQuery?.data) {
      return undefined;
    }

    const usageData = usageQuery.data;

    const numOfWallets = usageData.usage.embeddedWallets.countWalletAddresses;
    const limitWallets = usageData.limits.embeddedWallets;
    const percent = toPercent(numOfWallets, limitWallets);

    return {
      total: `${toNumber(numOfWallets)} / ${toNumber(
        limitWallets,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.embeddedWallets > 0
        ? {
            overage: usageData.billableUsd.embeddedWallets,
          }
        : {}),
    };
  }, [usageQuery]);

  return (
    <div className="border border-border rounded-lg p-4 md:px-10 md:py-12 flex flex-col lg:flex-row lg:justify-between gap-6 bg-muted/50">
      {/* Left */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Analytics</p>
        <h2 className="text-2xl tracking-tight font-semibold max-w-[500px] mb-5">
          View more insights about how users are interacting with your
          application
        </h2>

        <Button asChild variant="outline" size="sm">
          <TrackedLinkTW
            href="/dashboard/connect/analytics"
            category={trackingCategory}
            label="view-analytics"
            className="mt-auto min-w-[150px] gap-2"
          >
            View Analytics
            <ArrowRightIcon className="size-4" />
          </TrackedLinkTW>
        </Button>
      </div>

      {/* Right */}
      <div className="min-w-[280px]">
        {walletsMetrics && (
          <UsageCard
            {...walletsMetrics}
            name="Monthly Active Users"
            tooltip="Email wallet (with managed recovery code) usage is calculated by monthly active wallets (i.e. active as defined by at least 1 user log-in via email or social within the billing period month)."
          />
        )}
      </div>
    </div>
  );
};
