import {
  type CreateBackendWalletInput,
  useEngineCreateBackendWallet,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormLabel, Text } from "tw-components";

interface CreateBackendWalletButtonProps {
  instanceUrl: string;
}

export const CreateBackendWalletButton: React.FC<
  CreateBackendWalletButtonProps
> = ({ instanceUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const { mutate: createBackendWallet } =
    useEngineCreateBackendWallet(instanceUrl);
  const { onSuccess, onError } = useTxNotifications(
    "Wallet created successfully.",
    "Failed to create wallet.",
  );
  const trackEvent = useTrack();
  const form = useForm<CreateBackendWalletInput>();

  const onSubmit = async (data: CreateBackendWalletInput) => {
    createBackendWallet(data, {
      onSuccess: () => {
        onSuccess();
        onClose();
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "success",
          instance: instanceUrl,
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "error",
          instance: instanceUrl,
          error,
        });
      },
    });
  };

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
        <ModalContent className="!bg-background rounded-lg border border-border">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalHeader>Create {walletType} wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Wallet Type</FormLabel>
                  <Text>{walletType}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Label</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter a descriptive label"
                    {...form.register("label")}
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter as={Flex} gap={3}>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" colorScheme="primary">
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
