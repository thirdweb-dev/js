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
  Icon,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Button, CodeBlock, Text } from "tw-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";

interface AddAccessTokenButtonProps {
  instance: string;
}

export const AddAccessTokenButton: React.FC<AddAccessTokenButtonProps> = ({
  instance,
}) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createAccessToken } = useEngineCreateAccessToken(instance);
  const trackEvent = useTrack();

  const { onSuccess, onError } = useTxNotifications(
    "Access Token created successfully.",
    "Failed to create Access Token.",
  );

  return (
    <>
      <Flex alignItems="center" gap={2}>
        <Icon as={AiOutlinePlusCircle} boxSize={6} color="primary.500" />
        <Text
          color="primary.500"
          cursor="pointer"
          fontWeight="bold"
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "create-access-token",
              label: "attempt",
              instance,
            });
            createAccessToken(undefined, {
              onSuccess: (response) => {
                onSuccess();
                trackEvent({
                  category: "engine",
                  action: "create-access-token",
                  label: "success",
                  instance,
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
                  instance,
                  error,
                });
              },
            });
          }}
        >
          Create Access Token
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Access Token</ModalHeader>
          <ModalBody as={Flex} flexDir="column" gap={4}>
            <Text>
              This Access Token will only be shown to you once. Please copy it
              and store it in a safe place.
            </Text>
            <CodeBlock code={accessToken} />
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button
              type="submit"
              colorScheme="primary"
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
