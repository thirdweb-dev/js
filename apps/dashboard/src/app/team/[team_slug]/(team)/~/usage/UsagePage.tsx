"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { HStack } from "@chakra-ui/react";
import { BillingPeriod } from "components/settings/Account/Billing/Period";
import { BillingPlan } from "components/settings/Account/Billing/Plan";
import { Usage } from "components/settings/Account/Usage";

export const SettingsUsagePage = () => {
  const meQuery = useAccount();
  const usageQuery = useAccountUsage();
  const account = meQuery.data;

  if (meQuery.isLoading || !account) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="font-semibold text-3xl tracking-tight mb-2">Usage</h1>
        <HStack
          justifyContent="space-between"
          flexDir={{ base: "column", lg: "row" }}
          alignItems={{ base: "flex-start", lg: "center" }}
        >
          <BillingPlan account={account} />
          <BillingPeriod account={account} usage={usageQuery.data} />
        </HStack>
      </div>

      <Usage usage={usageQuery.data} usageLoading={usageQuery.isLoading} />
    </div>
  );
};
