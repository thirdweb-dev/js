import { useActiveChainId, useContractList } from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Button, Text, TrackedLink } from "tw-components";

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
    contractList.data?.findIndex((c) => c.address === contractAddress) === -1 &&
    contractList.isSuccess;

  const [hasClosedModal, setHasClosedModal] = useState(false);

  return (
    <Modal
      isOpen={shouldShow && !hasClosedModal}
      onClose={() => undefined}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>This contract is not on your dashboard</ModalHeader>
        <ModalBody>
          <Flex direction="column" gap={0}>
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
        </ModalBody>

        <ModalFooter as={Flex} direction="column" gap={6}>
          <TransactionButton
            w="full"
            mt="auto"
            justifySelf="flex-end"
            isLoading={
              addToDashboardMutation.isLoading || contractQuery.isLoading
            }
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
          <Button
            variant="ghost"
            w="full"
            size="xs"
            py={4}
            onClick={() => {
              trackEvent({
                category: "custom-contract",
                action: "add-to-dashboard",
                label: "skip",
                contractAddress,
              });
              setHasClosedModal(true);
            }}
          >
            Skip for now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
