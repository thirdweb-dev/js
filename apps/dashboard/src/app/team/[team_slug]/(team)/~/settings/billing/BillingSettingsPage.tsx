"use client";

import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
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
    return <GenericLoadingPage />;
  }

  return <Billing account={account} teamId={props.teamId} />;
};
