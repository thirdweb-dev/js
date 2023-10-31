import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
import {
  Card,
  Link,
  Text,
  Button,
  FormHelperText,
  TrackedLink,
} from "tw-components";

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
  const meQuery = useAccount();
  const address = useAddress();
  const form = useForm({
    defaultValues: {
      url: instance,
    },
  });

  const earlyAccessRequestformUrl = `https://share.hsforms.com/1k5tu00ueS5OYMaxHK6De-gea58c?email=${
    meQuery.data?.email || ""
  }&thirdweb_account_id=${meQuery.data?.id || ""}`;

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
            <Flex flexDir="column">
              <Text
                textAlign="center"
                color="primary.500"
                cursor="pointer"
                onClick={disclosure.onOpen}
              >
                Manage your Engine instance
              </Text>
            </Flex>
          </Card>

          <Text textAlign="left">
            Don&apos;t have Engine running yet?{" "}
            <Link
              href="https://portal.thirdweb.com/engine/getting-started"
              isExternal
              color="blue.500"
              fontSize="14px"
            >
              Self-host for free
            </Link>{" "}
            or{" "}
            <TrackedLink
              href={earlyAccessRequestformUrl}
              isExternal
              category="engine"
              label="clicked-request-early-access"
              fontWeight="medium"
              color="blue.500"
            >
              request a managed cloud-hosted instance
            </TrackedLink>
            .
          </Text>
        </Flex>
      )}
    </>
  );
};
