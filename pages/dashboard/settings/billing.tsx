import { AppLayout } from "components/app-layouts/app";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { ThirdwebNextPage } from "utils/types";
import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Billing } from "components/settings/Account/Billing";
import { useLocalStorage } from "hooks/useLocalStorage";
import { BillingConnectWalletPrompt } from "components/settings/Account/Billing/ConnectWallet";

const SettingsBillingPage: ThirdwebNextPage = () => {
  const { isLoggedIn, isLoading } = useLoggedInUser();
  const meQuery = useAccount();
  const router = useRouter();
  const { data: account } = meQuery;
  const [claimGrowth, setClaimGrowth] = useLocalStorage(
    "claim-growth-trial",
    false,
    true,
  );

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
    const {
      payment_intent,
      source_redirect_slug,
      claimGrowth: claimGrowthQuery,
    } = router.query;
    const hasClaimGrowth = claimGrowthQuery !== undefined;

    if (hasClaimGrowth) {
      setClaimGrowth(true);
    }

    if (payment_intent || source_redirect_slug || hasClaimGrowth) {
      router.replace("/dashboard/settings/billing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!isLoading && !isLoggedIn) {
    return claimGrowth ? (
      <BillingConnectWalletPrompt />
    ) : (
      <ConnectWalletPrompt />
    );
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
