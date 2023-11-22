import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { PaymentsSettingsAccount } from "components/payments/settings/payment-settings-account";
import { PaymentsWebhooks } from "components/payments/settings/payment-webhooks";
import { PaymentsSettingsChecklist } from "components/payments/settings/payment-settings-checklist";
import { NoWalletConnectedPayments } from "contract-ui/tabs/payments/components/no-wallet-connected-payments";
import { PaymentsSidebar } from "core-ui/sidebar/payments";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const PaymentsSettings: ThirdwebNextPage = () => {
  const { data: account } = useAccount();
  const { user } = useLoggedInUser();

  if (!user?.address) {
    return <NoWalletConnectedPayments />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      {account?.id && (
        <>
          <PaymentsSettingsChecklist accountId={account.id} />
          <PaymentsSettingsAccount accountId={account.id} />
          <PaymentsWebhooks accountId={account.id} />
        </>
      )}
    </Flex>
  );
};

PaymentsSettings.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <PaymentsSidebar activePage="settings" />
    {page}
  </AppLayout>
);

PaymentsSettings.pageId = PageId.PaymentsSettings;

export default PaymentsSettings;
