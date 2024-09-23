"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Billing } from "components/settings/Account/Billing";

export const SettingsBillingPage = () => {
  const meQuery = useAccount({
    refetchInterval: (query) =>
      [
        AccountStatus.InvalidPayment,
        AccountStatus.InvalidPaymentMethod,
      ].includes(query.state?.status as AccountStatus)
        ? 1000
        : false,
  });

  const { data: account } = meQuery;

  if (!account) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return <Billing account={account} />;
};
