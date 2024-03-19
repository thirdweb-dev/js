import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { PaymentsSettingsAccount } from "components/payments/settings/payment-settings-account";
import { PaymentsSettingsChecklist } from "components/payments/settings/payment-settings-checklist";
import { PaymentsWebhooks } from "components/payments/settings/payment-webhooks";
import { NoWalletConnectedPayments } from "contract-ui/tabs/payments/components/no-wallet-connected-payments";

export const OldPaySetting = () => {
  const { paymentsSellerId } = useApiAuthToken();
  const { user } = useLoggedInUser();

  if (!user?.address) {
    return <NoWalletConnectedPayments />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      {paymentsSellerId && (
        <>
          <PaymentsSettingsChecklist paymentsSellerId={paymentsSellerId} />
          <PaymentsSettingsAccount paymentsSellerId={paymentsSellerId} />
          <PaymentsWebhooks paymentsSellerId={paymentsSellerId} />
        </>
      )}
    </Flex>
  );
};
