import {
  useContractList,
  useEVMContractInfo,
  useMultiChainRegContractList,
} from "@3rdweb-sdk/react";
import {
  useAddContractMutation,
  useRemoveContractMutation,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { getDashboardChainRpc } from "lib/rpc";
import { useState } from "react";
import { Card, Heading, Text, TrackedLink } from "tw-components";

interface OnDashboardProps {
  contractAddress?: string;
}

export const OnDashboard: React.FC<OnDashboardProps> = ({
  contractAddress,
}) => {
  const trackEvent = useTrack();
  const activeChain = useEVMContractInfo()?.chain;
  const walletAddress = useAddress();
  const chainId = activeChain?.chainId || -1;

  const [addedState, setAddedState] = useState<"added" | "removed" | "none">(
    "none",
  );

  const oldRegistryContractList = useContractList(
    chainId,
    activeChain ? getDashboardChainRpc(activeChain) : "",
    walletAddress,
  );

  const newRegistryContractList = useMultiChainRegContractList(walletAddress);

  const addContract = useAddContractMutation();

  const { onSuccess: onAddSuccess, onError: onAddError } = useTxNotifications(
    "Successfully added to dashboard",
    "Failed to add to dashboard",
  );
  const { onSuccess: onRemoveSuccess, onError: onRemoveError } =
    useTxNotifications(
      "Successfully removed from dashboard",
      "Failed to remove from dashboard",
    );

  const onOldRegistry =
    oldRegistryContractList.isFetched &&
    oldRegistryContractList.data?.find((c) => c.address === contractAddress) &&
    oldRegistryContractList.isSuccess &&
    // contract can only be on the old registry if we haven't f'd with it
    addedState === "none";

  const onNewRegistry =
    (newRegistryContractList.isFetched &&
      newRegistryContractList.data?.find(
        (c) => c.address === contractAddress,
      ) &&
      newRegistryContractList.isSuccess) ||
    // if we added it is on the new registry for sure
    addedState === "added";

  const removeContract = useRemoveContractMutation(
    chainId,
    onOldRegistry ? "old" : onNewRegistry ? "new" : "none",
  );

  const onDashboard =
    addedState !== "removed" && (onNewRegistry || onOldRegistry);

  return walletAddress && contractAddress ? (
    <Card p={0}>
      <Flex direction="column">
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <Flex direction="column" gap={1}>
            <Heading size="title.md">
              {onDashboard ? "On dashboard" : "Not on dashboard"}
            </Heading>

            <Text>
              This contract is {onDashboard ? "" : "not "}currently displayed in
              the list of your contracts at{" "}
              <TrackedLink
                href="https://thirdweb.com/dashboard"
                isExternal
                category="custom-contract"
                label="visit-dashboard"
                color="blue.500"
              >
                /dashboard
              </TrackedLink>
              . You can {onDashboard ? "remove it from" : "add it to"} the list
              by clicking the button below. This action is reversible.
            </Text>
          </Flex>
        </Flex>
        {onDashboard ? (
          <TransactionButton
            w="full"
            mt="auto"
            justifySelf="flex-end"
            isLoading={removeContract.isLoading}
            transactionCount={1}
            colorScheme="red"
            type="submit"
            loadingText="Removing..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
            onClick={() => {
              trackEvent({
                category: "settings",
                action: "remove-from-dashboard",
                label: "attempt",
                contractAddress,
              });

              if (contractAddress) {
                removeContract.mutate(
                  {
                    contractAddress,
                  },
                  {
                    onSuccess: () => {
                      setAddedState("removed");
                      onRemoveSuccess();
                      trackEvent({
                        category: "settings",
                        action: "remove-from-dashboard",
                        label: "success",
                        contractAddress,
                      });
                    },
                    onError: (err) => {
                      onRemoveError(err);
                      trackEvent({
                        category: "settings",
                        action: "remove-from-dashboard",
                        label: "error",
                        contractAddress,
                        error: err,
                      });
                    },
                  },
                );
              }
            }}
          >
            Remove from dashboard
          </TransactionButton>
        ) : (
          <TransactionButton
            w="full"
            mt="auto"
            justifySelf="flex-end"
            isLoading={addContract.isLoading}
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
                category: "settings",
                action: "add-to-dashboard",
                label: "attempt",
                contractAddress,
              });

              if (contractAddress) {
                addContract.mutate(
                  {
                    contractAddress,
                    chainId,
                  },
                  {
                    onSuccess: () => {
                      setAddedState("added");
                      onAddSuccess();
                      trackEvent({
                        category: "settings",
                        action: "add-to-dashboard",
                        label: "success",
                        contractAddress,
                      });
                    },
                    onError: (err) => {
                      onAddError(err);
                      trackEvent({
                        category: "settings",
                        action: "add-to-dashboard",
                        label: "error",
                        contractAddress,
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
        )}
      </Flex>
    </Card>
  ) : null;
};
