import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { AppLayout } from "components/app-layouts/app";
import { Billing } from "components/settings/Account/Billing";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useEffect } from "react";
import type { ThirdwebNextPage } from "utils/types";

const SettingsBillingPage: ThirdwebNextPage = () => {
  const meQuery = useAccount({
    refetchInterval: (account) =>
      [
        AccountStatus.InvalidPayment,
        AccountStatus.InvalidPaymentMethod,
      ].includes(account?.status as AccountStatus)
        ? 1000
        : false,
  });

  const router = useRouter();
  const { data: account } = meQuery;

  const { payment_intent, source_redirect_slug } = router.query;

  // legit usecase, however will move to server side with RSCs
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (payment_intent || source_redirect_slug) {
      router.replace("/dashboard/settings/billing");
    }
  }, [payment_intent, router, source_redirect_slug]);

  if (!account) {
    return null;
  }

  return <Billing account={account} />;
};

SettingsBillingPage.pageId = PageId.SettingsUsage;

SettingsBillingPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="billing" />

    {page}
  </AppLayout>
);

export default SettingsBillingPage;
