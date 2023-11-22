import { useDashboardEVMChainId } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { usePaymentsContractByAddressAndChain } from "@3rdweb-sdk/react/hooks/usePayments";
import { Center, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { PaymentsAnalytics } from "./components/payments-analytics";
import { PaymentCheckouts } from "./components/payments-checkouts";
import { Card, Heading, Text } from "tw-components";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { NoWalletConnectedPayments } from "./components/no-wallet-connected-payments";
import { NoPaymentsEnabled } from "./components/no-payments-enabled";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";

interface ContractPaymentsPageProps {
  contractAddress?: string;
}

export const ContractPaymentsPage: React.FC<ContractPaymentsPageProps> = ({
  contractAddress,
}) => {
  const { data: account } = useAccount();
  const chainId = useDashboardEVMChainId();
  const { user } = useLoggedInUser();

  const {
    data: paymentContract,
    isLoading,
    isError,
  } = usePaymentsContractByAddressAndChain(contractAddress, chainId);

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!contractAddress) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!user?.address) {
    return <NoWalletConnectedPayments />;
  }

  return (
    <Flex direction="column" gap={6}>
      {isLoading ? (
        <Center pb={16}>
          <Spinner size="sm" />
        </Center>
      ) : paymentContract?.id ? (
        <Flex gap={4} flexDir="column">
          <Flex gap={2}>
            Contract ID:
            <AddressCopyButton
              title="contract ID"
              address={paymentContract?.id}
              size="xs"
            />
          </Flex>
          <PaymentCheckouts
            contractId={paymentContract?.id}
            contractAddress={contractAddress}
          />
          <PaymentsAnalytics contractId={paymentContract?.id} />
        </Flex>
      ) : isError ? (
        <Card p={8} bgColor="backgroundCardHighlight" my={6}>
          <Center as={Stack} spacing={2}>
            <Heading size="title.sm">Error loading contract</Heading>
            <Text>
              Please try again later or contact support if the problem persists
            </Text>
          </Center>
        </Card>
      ) : account?.id ? (
        <NoPaymentsEnabled
          contractAddress={contractAddress}
          chainId={chainId}
          accountId={account.id}
        />
      ) : null}
    </Flex>
  );
};
