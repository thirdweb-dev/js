"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { BillingPeriod } from "components/settings/Account/Billing/Period";
import { BillingPlan } from "components/settings/Account/Billing/Plan";
import { Usage } from "components/settings/Account/Usage";

export const SettingsUsagePage = () => {
  const meQuery = useAccount();
  const usageQuery = useAccountUsage();
  const account = meQuery.data;

  if (meQuery.isPending || !account) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="mb-2 font-semibold text-3xl tracking-tight">Usage</h1>
        <div className="flex flex-col items-start justify-between lg:flex-row lg:items-center">
          <BillingPlan account={account} />
          <BillingPeriod account={account} usage={usageQuery.data} />
        </div>
      </div>

      <Usage usage={usageQuery.data} usagePending={usageQuery.isPending} />
    </div>
  );
};
