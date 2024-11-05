"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { accountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Billing } from "components/settings/Account/Billing";

export const SettingsBillingPage = (props: {
  teamId: string | undefined;
}) => {
  const meQuery = useAccount({
    refetchInterval: (query) => {
      const status = query.state?.status as string;
      const isInvalidPayment =
        status === accountStatus.invalidPayment ||
        status === accountStatus.invalidPaymentMethod;

      return isInvalidPayment ? 1000 : false;
    },
  });

  const { data: account } = meQuery;

  if (!account) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return <Billing account={account} teamId={props.teamId} />;
};
