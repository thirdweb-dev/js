import {
  Flex,
  FormControl,
  Icon,
  Image,
  Input,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useForm } from "react-hook-form";
import { FiArrowRight } from "react-icons/fi";
import {
  Card,
  Link,
  Text,
  Button,
  FormHelperText,
  Heading,
} from "tw-components";
import { EngineHostingOptionsCta } from "./hosting-options-cta";

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
        <>
          <LinkBox my={6}>
            <Card
              p={10}
              _hover={{
                borderColor: "blue.500",
              }}
              transitionDuration="200ms"
              bgColor="backgroundHighlight"
              borderColor="#0000"
            >
              <Stack spacing={4}>
                <LinkOverlay href="#" onClick={disclosure.onOpen}>
                  <Flex align="center" gap={2}>
                    <Image
                      src="/assets/engine/cloud-icon.png"
                      alt="cloud icon"
                      w={8}
                    />
                    <Heading size="title.sm">Add my Engine instance</Heading>
                    <Icon as={FiArrowRight} boxSize={6} />
                  </Flex>
                </LinkOverlay>

                <Text>
                  Manage Engine by providing the URL to your running Engine
                  instance.
                </Text>
              </Stack>
            </Card>
          </LinkBox>

          <EngineHostingOptionsCta />
        </>
      )}
    </>
  );
};
