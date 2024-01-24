import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Billing } from "components/settings/Account/Billing";

const SettingsBillingPage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const router = useRouter();
  const { data: account } = meQuery;

  useEffect(() => {
    let refetchInterval: ReturnType<typeof setInterval> | undefined;

    if (
      [AccountStatus.NoPayment, AccountStatus.PaymentVerification].includes(
        account?.status as AccountStatus,
      )
    ) {
      refetchInterval = setInterval(() => {
        meQuery.refetch();
      }, 3000);
    } else if (refetchInterval) {
      clearTimeout(refetchInterval);
    }

    return () => {
      if (refetchInterval) {
        clearTimeout(refetchInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    const { payment_intent, source_redirect_slug } = router.query;
    if (payment_intent || source_redirect_slug) {
      router.replace("/dashboard/settings/billing");
    }
  }, [router]);

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="manage your billing account" />;
  }

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
