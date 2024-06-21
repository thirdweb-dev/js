import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { validPaymentsChainIds } from "@3rdweb-sdk/react/hooks/usePayments";
import { useAllContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { NoWalletConnectedPayments } from "contract-ui/tabs/payments/components/no-wallet-connected-payments";
import { useMemo } from "react";
import { PaymentContractsTable } from "./payment-contracts-table";

export const PaymentContracts = () => {
  const address = useAddress();
  const deployedContracts = useAllContractList(address);
  const { paymentsSellerId } = useApiAuthToken();

  const filteredByChain = useMemo(() => {
    if (!deployedContracts?.data) {
      return [];
    }

    return deployedContracts.data.filter((contract) =>
      validPaymentsChainIds.includes(contract.chainId),
    );
  }, [deployedContracts?.data]);

  return (
    <Flex flexDir="column" gap={3}>
      {paymentsSellerId ? (
        <PaymentContractsTable
          paymentContracts={filteredByChain || []}
          paymentsSellerId={paymentsSellerId}
          isLoading={deployedContracts.isLoading}
          isFetched={deployedContracts.isFetched}
        />
      ) : (
        <NoWalletConnectedPayments />
      )}
    </Flex>
  );
};
