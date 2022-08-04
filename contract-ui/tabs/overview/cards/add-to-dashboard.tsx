import { useActiveChainId, useContractList } from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { PotentialContractInstance } from "contract-ui/types/types";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Card, Heading, Text, TrackedLink } from "tw-components";

export const AddToDashboardCard = <
  TContract extends PotentialContractInstance,
>({
  contract,
  prebuilt,
}: {
  contract: TContract;
  prebuilt?: boolean;
}) => {
  const activeChainId = useActiveChainId();
  const address = useAddress();
  const contractList = useContractList(activeChainId || -1, address);
  const addToDashboardMutation = useAddContractMutation();

  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Added to dashboard",
    "Failed to add to dashboard",
  );

  const shouldShow =
    contractList.isFetched &&
    contractList.data?.findIndex(
      (c) => c.address === contract?.getAddress(),
    ) === -1 &&
    contractList.isSuccess;

  return shouldShow ? (
    <Card p={0}>
      <Flex direction="column">
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <Flex direction="column" gap={1}>
            <Heading size="title.md">Add to dashboard</Heading>
            <Text>
              When you add this contract to the dashboard it will be displayed
              in the list of your contracts at{" "}
              <TrackedLink
                href="https://thirdweb.com/dashboard"
                isExternal
                category="custom-contract"
                label="visit-dashboard"
                color="primary.500"
              >
                /dashboard
              </TrackedLink>
              .
            </Text>
          </Flex>
        </Flex>
        <TransactionButton
          w="full"
          mt="auto"
          justifySelf="flex-end"
          isLoading={addToDashboardMutation.isLoading}
          transactionCount={1}
          colorScheme="primary"
          type="submit"
          loadingText="Saving..."
          size="md"
          borderRadius="xl"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
          onClick={() => {
            trackEvent({
              category: `${prebuilt ? "prebuilt" : "custom"}-contract`,
              action: "add-to-dashboard",
              label: "attempt",
              contractAddress: contract?.getAddress(),
            });

            if (contract?.getAddress()) {
              addToDashboardMutation.mutate(
                {
                  contractAddress: contract?.getAddress(),
                },
                {
                  onSuccess: () => {
                    onSuccess();
                    trackEvent({
                      category: `${prebuilt ? "prebuilt" : "custom"}-contract`,
                      action: "add-to-dashboard",
                      label: "success",
                      contractAddress: contract?.getAddress(),
                    });
                  },
                  onError: (err) => {
                    onError(err);
                    trackEvent({
                      category: `${prebuilt ? "prebuilt" : "custom"}-contract`,
                      action: "add-to-dashboard",
                      label: "error",
                      contractAddress: contract?.getAddress(),
                      error: err,
                    });
                  },
                },
              );
            }
          }}
        >
          Add to dashboard
        </TransactionButton>
      </Flex>
    </Card>
  ) : null;
};
