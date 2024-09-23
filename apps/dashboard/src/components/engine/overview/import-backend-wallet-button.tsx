import {
  type ImportBackendWalletInput,
  useEngineImportBackendWallet,
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
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormLabel } from "tw-components";

interface ImportBackendWalletButtonProps {
  instanceUrl: string;
}

export const ImportBackendWalletButton: React.FC<
  ImportBackendWalletButtonProps
> = ({ instanceUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const { mutate: importBackendWallet } =
    useEngineImportBackendWallet(instanceUrl);
  const { onSuccess, onError } = useTxNotifications(
    "Wallet imported successfully.",
    "Failed to import wallet.",
  );
  const trackEvent = useTrack();
  const form = useForm<ImportBackendWalletInput>();

  const walletType =
    walletConfig?.type === "aws-kms"
      ? "AWS KMS"
      : walletConfig?.type === "gcp-kms"
        ? "GCP KMS"
        : "local";

  return (
    <>
      <Button onClick={onOpen} colorScheme="primary" variant="outline">
        Import
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          className="!bg-background rounded-lg border border-border"
          as="form"
          onSubmit={form.handleSubmit((data) => {
            importBackendWallet(data, {
              onSuccess: () => {
                onSuccess();
                onClose();
                trackEvent({
                  category: "engine",
                  action: "import-backend-wallet",
                  label: "success",
                  type: walletConfig?.type,
                  instance: instanceUrl,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "engine",
                  action: "import-backend-wallet",
                  label: "error",
                  type: walletConfig?.type,
                  instance: instanceUrl,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>Import {walletType} wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {walletConfig?.type === "local" && (
              <FormControl isRequired>
                <FormLabel>Private key</FormLabel>
                <Input
                  placeholder="Your wallet private key"
                  autoComplete="off"
                  type="text"
                  {...form.register("privateKey", { required: true })}
                />
              </FormControl>
            )}
            {walletConfig?.type === "aws-kms" && (
              <Flex flexDir="column" gap={4}>
                <FormControl isRequired>
                  <FormLabel>AWS KMS Key ID</FormLabel>
                  <Input
                    placeholder=""
                    autoComplete="off"
                    type="text"
                    {...form.register("awsKmsKeyId", { required: true })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>AWS KMS ARN</FormLabel>
                  <Input
                    placeholder=""
                    autoComplete="off"
                    type="text"
                    {...form.register("awsKmsArn", { required: true })}
                  />
                </FormControl>
              </Flex>
            )}
            {walletConfig?.type === "gcp-kms" && (
              <Flex flexDir="column" gap={4}>
                <FormControl isRequired>
                  <FormLabel>GCP KMS Key ID</FormLabel>
                  <Input
                    placeholder=""
                    autoComplete="off"
                    type="text"
                    {...form.register("gcpKmsKeyId", { required: true })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>GCP KMS Version ID</FormLabel>
                  <Input
                    placeholder=""
                    autoComplete="off"
                    type="text"
                    {...form.register("gcpKmsKeyVersionId", { required: true })}
                  />
                </FormControl>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary">
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
