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
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useForm } from "react-hook-form";
import { Card, Link, Text, Button, FormHelperText } from "tw-components";

function simplifyURL(url: string): string {
  const parsedURL = new URL(url);
  return `${parsedURL.protocol}//${parsedURL.host}/`;
}

interface NoEngineInstanceProps {
  instance: string;
  setInstanceUrl: (value: string) => void;
  disclosure: UseDisclosureReturn;
}

export const NoEngineInstance: React.FC<NoEngineInstanceProps> = ({
  instance,
  setInstanceUrl,
  disclosure,
}) => {
  const address = useAddress();
  const form = useForm({
    defaultValues: {
      url: instance,
    },
  });

  return (
    <>
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            setInstanceUrl(simplifyURL(data.url));
            disclosure.onClose();
          })}
        >
          <ModalHeader>Set Engine Instance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <Input
                type="url"
                placeholder="Enter your Engine URL"
                autoFocus
                {...form.register("url")}
              />
              <FormHelperText>
                Only https:// URLs are accepted.{" "}
                <Link
                  href="https://portal.thirdweb.com/engine/getting-started"
                  color="primary.500"
                  isExternal
                >
                  Learn more
                </Link>
                .
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={disclosure.onClose} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="primary" type="submit">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {!instance && address && (
        <Flex flexDir="column" gap={4}>
          <Card py={12}>
            <Flex flexDir="column" gap={2}>
              <Text textAlign="center">
                It looks like you&apos;re not managing any Engine instances yet.
              </Text>
              <Text
                textAlign="center"
                color="primary.500"
                cursor="pointer"
                onClick={disclosure.onOpen}
              >
                Set Engine instance URL to get started.
              </Text>
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
};
