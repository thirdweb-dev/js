import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { useEngineCreateAccessToken } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { Button, Checkbox, Text } from "tw-components";

interface AddAccessTokenButtonProps {
  instanceUrl: string;
}

export const AddAccessTokenButton: React.FC<AddAccessTokenButtonProps> = ({
  instanceUrl,
}) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createAccessToken } = useEngineCreateAccessToken(instanceUrl);
  const trackEvent = useTrack();
  const [hasStoredToken, setHasStoredToken] = useState<boolean>(false);

  const { onSuccess, onError } = useTxNotifications(
    "Access token created successfully.",
    "Failed to create Access Token.",
  );

  return (
    <>
      <Button
        onClick={() => {
          createAccessToken(undefined, {
            onSuccess: (response) => {
              onSuccess();
              trackEvent({
                category: "engine",
                action: "create-access-token",
                label: "success",
                instance: instanceUrl,
              });
              setAccessToken(response.accessToken);
              onOpen();
            },
            onError: (error) => {
              onError(error);
              trackEvent({
                category: "engine",
                action: "create-access-token",
                label: "error",
                instance: instanceUrl,
                error,
              });
            },
          });
        }}
        variant="ghost"
        size="sm"
        leftIcon={<CirclePlusIcon className="size-6" />}
        colorScheme="primary"
        w="fit-content"
      >
        Create Access Token
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="!bg-background rounded-lg border border-border">
          <ModalHeader>Access token</ModalHeader>
          <ModalBody as={Flex} flexDir="column" gap={4}>
            <div className="flex flex-col gap-4">
              <PlainTextCodeBlock code={accessToken} />
              <Text color="red.500">
                This access token will not be shown again.
              </Text>
              <Checkbox
                checked={hasStoredToken}
                onChange={(e) => setHasStoredToken(e.target.checked)}
              >
                I have securely stored this access token.
              </Checkbox>
            </div>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button
              type="submit"
              colorScheme="primary"
              isDisabled={!hasStoredToken}
              onClick={() => {
                onClose();
                setAccessToken("");
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
