import { useActiveChainId, useContractList } from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex } from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FeedbackForm } from "components/feedback/feedback-form";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { Card, Heading, Text } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const address = useAddress();
  const contractQuery = useContract(contractAddress);

  const { trackEvent } = useTrack();

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  if (!contractQuery || contractQuery?.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <AddToDashboardCardCTA contractAddress={contractAddress} />

        {/* we only show the feedback form on custom cotnracts */}
        {contractQuery.data?.contractType === "custom" && (
          <Card flexGrow={1}>
            <FeedbackForm
              trackEvent={trackEvent}
              wallet={address}
              scope="thirdweb-deploy"
              localStorageKey={`tw_deploy-${contractAddress}`}
            />
          </Card>
        )}
      </Flex>
    </Flex>
  );
};

interface AddToDashboardCardCTAProps {
  contractAddress: string;
}

const AddToDashboardCardCTA: React.FC<AddToDashboardCardCTAProps> = ({
  contractAddress,
}) => {
  const activeChainId = useActiveChainId();
  const address = useAddress();
  const contractList = useContractList(activeChainId || -1, address);
  const contractQuery = useContract(contractAddress);
  const addToDashboardMutation = useAddContractMutation();
  const { onSuccess, onError } = useTxNotifications(
    "Added to dashboard",
    "Failed to add to dashboard",
  );
  const shouldShow = useMemo(() => {
    return (
      contractList.data?.findIndex((c) => c.address === contractAddress) === -1
    );
  }, [contractAddress, contractList.data]);

  if (!shouldShow) {
    return null;
  }
  return (
    <Card
      as={Flex}
      flexGrow={1}
      maxW="sm"
      position="relative"
      overflow="hidden"
      flexDirection="column"
      gap={6}
    >
      <Flex direction="column" gap={0}>
        <Heading as="h2" size="subtitle.md">
          Add To Dashboard
        </Heading>

        <Text>
          Adding this contract to your dashboard lets you easily find it again
          later.
        </Text>
      </Flex>
      <TransactionButton
        mt="auto"
        justifySelf="flex-end"
        isLoading={addToDashboardMutation.isLoading || contractQuery.isLoading}
        isDisabled={!contractQuery?.data?.contractType}
        transactionCount={1}
        colorScheme="primary"
        onClick={() => {
          if (!contractQuery.data?.contractType) {
            return;
          }
          addToDashboardMutation.mutate(
            {
              contractAddress,
              contractType: contractQuery.data.contractType,
            },
            {
              onSuccess,
              onError,
            },
          );
        }}
      >
        Add to dashboard
      </TransactionButton>
    </Card>
  );
};
