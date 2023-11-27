import { useAllContractList } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { PaymentContractsTable } from "./payment-contracts-table";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { NoWalletConnectedPayments } from "contract-ui/tabs/payments/components/no-wallet-connected-payments";

export const PaymentContracts = () => {
  const address = useAddress();
  const deployedContracts = useAllContractList(address);
  const { data: account } = useAccount();

  return (
    <Flex flexDir="column" gap={3}>
      {account?.id ? (
        <PaymentContractsTable
          paymentContracts={deployedContracts?.data || []}
          accountId={account.id}
          isLoading={deployedContracts.isLoading}
          isFetched={deployedContracts.isFetched}
        />
      ) : (
        <NoWalletConnectedPayments />
      )}
    </Flex>
  );
};
