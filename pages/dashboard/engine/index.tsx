import {
  Center,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { EngineSidebar } from "core-ui/sidebar/engine";
import { PageId } from "page-id";
import { Button, FormHelperText, Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { NoEngineInstance } from "components/engine/no-engine-instance";
import { useLocalStorage } from "hooks/useLocalStorage";
import { NoConnectedWallet } from "components/engine/no-connected-wallet";
import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineNavigation } from "components/engine/engine-navigation";
import { NoAuthorizedWallet } from "components/engine/no-authorized-wallet";
import { NoServerConnection } from "components/engine/no-server-connection";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useForm } from "react-hook-form";

const EngineManage: ThirdwebNextPage = () => {
  const [instanceUrl, setInstanceUrl] = useLocalStorage("engine-instance", "");
  const setInstanceDisclosure = useDisclosure();
  const { user } = useLoggedInUser();

  const enginePermissions = useEnginePermissions(instanceUrl);

  // If able to request the admin list, the logged in user has Engine access.
  const hasEngineAccess = enginePermissions.data
    ? enginePermissions.data.length > 0
    : false;

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="column" gap={4}>
        <Flex direction="column" gap={2}>
          <Heading size="title.lg" as="h1">
            Get started with Engine
          </Heading>
          <Text>
            Engine is a backend HTTP server that calls smart contracts with your
            managed backend wallets.
          </Text>
        </Flex>

        {instanceUrl && (
          <Flex align="center" gap={1}>
            <Image src="/assets/engine/cloud-icon.png" alt="cloud icon" w={4} />
            <Text fontWeight="bold">{instanceUrl}</Text>
            <Button
              size="sm"
              variant="link"
              onClick={setInstanceDisclosure.onOpen}
              color="blue.500"
            >
              Edit
            </Button>
          </Flex>
        )}

        {/* Modal to provide an Engine instance URL. */}
        <AddEngineInstanceModal
          instance={instanceUrl}
          setInstanceUrl={setInstanceUrl}
          disclosure={setInstanceDisclosure}
        />

        {!user?.address ? (
          // User not signed in.
          <NoConnectedWallet instance={instanceUrl} />
        ) : !instanceUrl ? (
          // No Engine connected.
          <NoEngineInstance disclosure={setInstanceDisclosure} />
        ) : enginePermissions.isLoading ? (
          // Engine is connecting.
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Connecting to your Engine...</Text>
            </Flex>
          </Center>
        ) : enginePermissions.isError &&
          (enginePermissions?.error as { message: string }).message ===
            "401" ? (
          // Not authorized to connect to this Engine instance.
          <NoAuthorizedWallet
            instance={instanceUrl}
            disclosure={setInstanceDisclosure}
          />
        ) : enginePermissions.isError &&
          (enginePermissions?.error as { message: string }).message ===
            "Failed to fetch" ? (
          // Error connecting to Engine.
          <NoServerConnection
            instance={instanceUrl}
            disclosure={setInstanceDisclosure}
          />
        ) : hasEngineAccess ? (
          // Connected to Engine.
          <EngineNavigation instance={instanceUrl} />
        ) : null}
      </Flex>
    </Flex>
  );
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar activePage="manage" />
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;

const AddEngineInstanceModal = ({
  instance,
  setInstanceUrl,
  disclosure,
}: {
  instance: string;
  setInstanceUrl: (value: string) => void;
  disclosure: UseDisclosureReturn;
}) => {
  const form = useForm({
    defaultValues: {
      url: instance,
    },
  });

  const getCanonicalUrl = (url: string): string => {
    const parsedURL = new URL(url);
    return `${parsedURL.protocol}//${parsedURL.host}/`;
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={form.handleSubmit((data) => {
          setInstanceUrl(getCanonicalUrl(data.url));
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
  );
};
