import { useActiveChainId, useContractList } from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex } from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Card, Heading, Text } from "tw-components";

interface AddToDashboardCardProps {
  contractAddress: string;
}

export const AddToDashboardCard: React.FC<AddToDashboardCardProps> = ({
  contractAddress,
}) => {
  const activeChainId = useActiveChainId();
  const address = useAddress();
  const contractList = useContractList(activeChainId || -1, address);
  const contractQuery = useContract(contractAddress);
  const addToDashboardMutation = useAddContractMutation();
  const { trackEvent } = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Added to dashboard",
    "Failed to add to dashboard",
  );

  const shouldShow =
    contractList.data?.findIndex((c) => c.address === contractAddress) === -1;

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

          trackEvent({
            category: "custom-contract",
            action: "add-to-dashboard",
            label: "attempt",
            contractAddress,
          });

          addToDashboardMutation.mutate(
            {
              contractAddress,
              contractType: contractQuery.data.contractType,
            },
            {
              onSuccess: () => {
                onSuccess();
                trackEvent({
                  category: "custom-contract",
                  action: "add-to-dashboard",
                  label: "success",
                  contractAddress,
                });
              },
              onError: (err) => {
                onError(err);
                trackEvent({
                  category: "custom-contract",
                  action: "add-to-dashboard",
                  label: "error",
                  contractAddress,
                  error: err,
                });
              },
            },
          );
        }}
      >
        Add to dashboard
      </TransactionButton>
    </Card>
  );
};
