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
import { FormEventHandler, useRef } from "react";
import { Card, Link, Text, Button } from "tw-components";

function simplifyURL(url: string): string {
  const parsedURL = new URL(url);
  return `${parsedURL.protocol}//${parsedURL.host}/`;
}

interface NoEngineInstanceProps {
  setInstanceUrl: (value: string) => void;
}

export const NoEngineInstance: React.FC<NoEngineInstanceProps> = ({
  setInstanceUrl,
}) => {
  const instanceUrlRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit: FormEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const url = instanceUrlRef.current?.value ?? "";
    setInstanceUrl(simplifyURL(url));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={onSubmit}>
          <ModalHeader>Set Engine Instance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <Input
                ref={instanceUrlRef}
                type="url"
                id="url"
                placeholder="Enter your Engine URL"
                autoFocus
              />
            </FormControl>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="primary" type="submit">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDir="column" gap={4}>
        <Text>
          Engine provides a server-side interface for contracts & wallets,
          without the complexities of wallet and transaction management.{" "}
          <Link
            color="blue.500"
            href="https://portal.thirdweb.com/engine"
            isExternal
          >
            Learn more
          </Link>
          .
        </Text>
        <Card py={12}>
          <Flex flexDir="column" gap={2}>
            <Text textAlign="center">
              It looks like you&apos;re not managing any Engine instances yet.
            </Text>
            <Text
              textAlign="center"
              color="primary.500"
              cursor="pointer"
              onClick={onOpen}
            >
              Set Engine instance URL to get started.
            </Text>
          </Flex>
        </Card>
      </Flex>
    </>
  );
};
