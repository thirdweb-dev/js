import { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  ButtonGroup,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
  UseDisclosureReturn,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import {
  Button,
  Card,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { AddEngineInstanceButton } from "./add-engine-instance";
import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { useAddress } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";

interface EngineInstancesListProps {
  instances: EngineInstance[];
  refetch: () => void;
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineInstancesList = ({
  instances,
  refetch,
  setConnectedInstance,
}: EngineInstancesListProps) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const trackEvent = useTrack();

  const [instanceToUpdate, setInstanceToUpdate] = useState<
    EngineInstance | undefined
  >();

  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="title.lg" as="h1">
          Engine
        </Heading>
        <Text>
          Engine is a backend HTTP server that calls smart contracts with your
          backend wallets.{" "}
          <TrackedLink
            href="https://portal.thirdweb.com/engine"
            isExternal
            category="engine"
            label="clicked-learn-more"
            color="blue.500"
          >
            Learn more about Engine
          </TrackedLink>
          .
        </Text>
      </Stack>

      <Stack spacing={4}>
        {instances.length === 0 ? (
          <Card p={8}>
            <Stack>
              <Heading size="label.lg">Get Started</Heading>
              <Text>
                View Engine instances you&apos;ve set up and imported here.
              </Text>
            </Stack>
          </Card>
        ) : (
          instances.map((instance) => {
            return (
              <Card
                key={instance.id}
                as={Flex}
                justifyContent="space-between"
                alignContent="flex-start"
                p={8}
              >
                <Stack>
                  <Heading size="label.lg">{instance.name}</Heading>
                  <Text fontSize="small">{instance.url}</Text>
                </Stack>

                <ButtonGroup variant="ghost" spacing={3}>
                  <ConnectButton
                    instance={instance}
                    setConnectedInstance={setConnectedInstance}
                  />

                  <Tooltip label="Edit">
                    <IconButton
                      onClick={() => {
                        trackEvent({
                          category: "engine",
                          action: "edit",
                          label: "open-modal",
                        });
                        setInstanceToUpdate(instance);
                        editDisclosure.onOpen();
                      }}
                      icon={<BiPencil />}
                      aria-label="Edit"
                    />
                  </Tooltip>
                  <Tooltip label="Remove">
                    <IconButton
                      onClick={() => {
                        trackEvent({
                          category: "engine",
                          action: "remove",
                          label: "open-modal",
                        });
                        setInstanceToUpdate(instance);
                        removeDisclosure.onOpen();
                      }}
                      icon={<FiTrash />}
                      aria-label="Remove"
                    />
                  </Tooltip>
                </ButtonGroup>
              </Card>
            );
          })
        )}
      </Stack>

      {editDisclosure.isOpen && instanceToUpdate && (
        <EditModal
          instance={instanceToUpdate}
          disclosure={editDisclosure}
          refetch={refetch}
        />
      )}
      {removeDisclosure.isOpen && instanceToUpdate && (
        <RemoveModal
          instance={instanceToUpdate}
          disclosure={removeDisclosure}
          refetch={refetch}
        />
      )}

      <AddEngineInstanceButton refetch={refetch} />
    </Stack>
  );
};

const ConnectButton = ({
  instance,
  setConnectedInstance,
}: {
  instance: EngineInstance;
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}) => {
  const { token } = useApiAuthToken();
  const address = useAddress();
  const toast = useToast();
  const trackEvent = useTrack();

  const [isLoading, setIsLoading] = useState(false);

  const onClickConnect = async () => {
    setIsLoading(true);

    // Make an authed request.
    // If it fails to fetch, the server is unreachable.
    // If it returns a 401, the user is not a valid admin.
    try {
      const res = await fetch(`${instance.url}auth/permissions/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        trackEvent({
          category: "engine",
          action: "connect",
          label: "success",
        });
        setConnectedInstance(instance);
      } else if (res.status === 401) {
        trackEvent({
          category: "engine",
          action: "connect",
          label: "unauthorized",
        });
        toast({
          status: "error",
          title: "Unauthorized",
          description: `You are not an admin for this Engine instance. Contact the owner to add your wallet as an admin: ${address}`,
          duration: null,
          isClosable: true,
        });
      } else {
        throw new Error(`Unexpected status code ${res.status}`);
      }
    } catch (e: any) {
      if (e?.message === "Failed to fetch") {
        trackEvent({
          category: "engine",
          action: "connect",
          label: "unreachable",
        });
        toast({
          status: "error",
          description: `Unable to connect to ${instance.url}. Ensure that your Engine is publicly accessible.`,
          duration: null,
          isClosable: true,
        });
      } else {
        toast({
          status: "error",
          description:
            "There was an unexpected error reaching your Engine instance. Try again or contact us if this issue persists.",
          duration: null,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClickConnect}
      variant="outline"
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      Connect
    </Button>
  );
};

const EditModal = ({
  instance,
  disclosure,
  refetch,
}: {
  disclosure: UseDisclosureReturn;
  instance: EngineInstance;
  refetch: () => void;
}) => {
  const toast = useToast();
  const { onClose } = disclosure;

  const form = useForm({
    defaultValues: {
      name: instance?.name,
      url: instance?.url,
    },
  });

  const onSubmit = async (data: { name: string; url: string }) => {
    // Instance URLs should end with a /.
    const url = data.url.endsWith("/") ? data.url : `${data.url}/`;

    try {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine/${instance.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          url,
        }),
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}`);
      }
      toast({
        status: "success",
        description: "Updated an Engine instance.",
      });
      refetch();
      onClose();
    } catch (e) {
      toast({
        status: "error",
        description: "Error updating an Engine instance.",
      });
    }
  };

  return (
    <Modal isOpen onClose={onClose} isCentered size="lg">
      <ModalOverlay />

      <ModalContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalHeader>Edit Engine Instance</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter a descriptive label"
                  autoFocus
                  {...form.register("name")}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>URL</FormLabel>
                <Input
                  type="url"
                  placeholder="Enter your Engine URL"
                  {...form.register("url")}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const RemoveModal = ({
  instance,
  disclosure,
  refetch,
}: {
  instance: EngineInstance;
  disclosure: UseDisclosureReturn;
  refetch: () => void;
}) => {
  const toast = useToast();
  const { onClose } = disclosure;

  const onClickRemove = async () => {
    try {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine/${instance.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}`);
      }
      toast({
        status: "success",
        description: "Removed an Engine instance from your dashboard.",
      });
      refetch();
      onClose();
    } catch (e) {
      toast({
        status: "error",
        description: "Error removing an Engine instance from your dashboard.",
      });
    }
  };

  return (
    <Modal isOpen onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Engine Instance</ModalHeader>

        <ModalBody>
          <Stack spacing={4}>
            <Text>
              Are you sure you want to remove <strong>{instance?.name}</strong>{" "}
              from your dashboard?
            </Text>
            <Card>
              <Text>
                This action will not modify your Engine infrastructure, and you
                can re-add this Engine URL in the future.
              </Text>
            </Card>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={onClickRemove} colorScheme="red">
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
