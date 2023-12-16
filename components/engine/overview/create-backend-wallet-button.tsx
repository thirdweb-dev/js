import {
  useEngineCreateBackendWallet,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Button } from "tw-components";

interface CreateBackendWalletButtonProps {
  instance: string;
}

export const CreateBackendWalletButton: React.FC<
  CreateBackendWalletButtonProps
> = ({ instance }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: walletConfig } = useEngineWalletConfig(instance);
  const { mutate: createBackendWallet } =
    useEngineCreateBackendWallet(instance);
  const { onSuccess, onError } = useTxNotifications(
    "Wallet created successfully.",
    "Failed to create wallet.",
  );
  const trackEvent = useTrack();

  const walletType =
    walletConfig?.type === "aws-kms"
      ? "AWS KMS"
      : walletConfig?.type === "gcp-kms"
      ? "GCP KMS"
      : "local";

  return (
    <>
      <Button onClick={onOpen} colorScheme="primary">
        Create
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create {walletType} wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to create a {walletType} backend wallet?
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                createBackendWallet(undefined, {
                  onSuccess: () => {
                    onSuccess();
                    onClose();
                    trackEvent({
                      category: "engine",
                      action: "create-backend-wallet",
                      label: "success",
                      instance,
                    });
                  },
                  onError: (error) => {
                    onError(error);
                    trackEvent({
                      category: "engine",
                      action: "create-backend-wallet",
                      label: "error",
                      instance,
                      error,
                    });
                  },
                });
              }}
              colorScheme="primary"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
