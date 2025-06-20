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
import { useTxNotifications } from "hooks/useTxNotifications";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { Button, Text } from "tw-components";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";

interface AddAccessTokenButtonProps {
  instanceUrl: string;
  authToken: string;
}

export const AddAccessTokenButton: React.FC<AddAccessTokenButtonProps> = ({
  instanceUrl,
  authToken,
}) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createAccessToken } = useEngineCreateAccessToken({
    authToken,
    instanceUrl,
  });

  const [hasStoredToken, setHasStoredToken] = useState<boolean>(false);

  const { onSuccess, onError } = useTxNotifications(
    "Access token created successfully.",
    "Failed to create Access Token.",
  );

  return (
    <>
      <Button
        colorScheme="primary"
        leftIcon={<CirclePlusIcon className="size-6" />}
        onClick={() => {
          createAccessToken(undefined, {
            onError: (error) => {
              onError(error);
              console.error(error);
            },
            onSuccess: (response) => {
              onSuccess();
              setAccessToken(response.accessToken);
              onOpen();
            },
          });
        }}
        size="sm"
        variant="ghost"
        w="fit-content"
      >
        Create Access Token
      </Button>

      <Modal
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
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
              <CheckboxWithLabel>
                <Checkbox
                  checked={hasStoredToken}
                  onCheckedChange={(val) => setHasStoredToken(!!val)}
                />
                <span>I have securely stored this access token.</span>
              </CheckboxWithLabel>
            </div>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button
              colorScheme="primary"
              isDisabled={!hasStoredToken}
              onClick={() => {
                onClose();
                setAccessToken("");
              }}
              type="submit"
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
