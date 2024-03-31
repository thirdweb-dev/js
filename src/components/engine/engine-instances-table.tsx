import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import {
  EngineInstance,
  useEngineInstances,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  HStack,
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
import { createColumnHelper } from "@tanstack/react-table";
import { useAddress } from "@thirdweb-dev/react";
import { TWTable } from "components/shared/TWTable";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { FiArrowRight, FiTrash } from "react-icons/fi";
import { Badge, Button, Card, FormLabel, Text } from "tw-components";

interface EngineInstancesTableProps {
  instances: EngineInstance[];
  isLoading: boolean;
  isFetched: boolean;
  refetch: ReturnType<typeof useEngineInstances>["refetch"];
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineInstancesTable: React.FC<EngineInstancesTableProps> = ({
  instances,
  isLoading,
  isFetched,
  refetch,
  setConnectedInstance,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const trackEvent = useTrack();
  const { token } = useApiAuthToken();
  const address = useAddress();
  const toast = useToast();

  const [instanceToUpdate, setInstanceToUpdate] = useState<
    EngineInstance | undefined
  >();

  const onClickConnect = async (engineInstanceId: string) => {
    const instance = instances.find((i) => engineInstanceId === i.id);
    if (!instance) {
      return;
    }

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
    }
  };

  const columnHelper = createColumnHelper<EngineInstance>();
  const columns = [
    columnHelper.accessor("id", {
      header: "Engine Instances",
      cell: (cell) => {
        const { id, name, url, status } = cell.row.original;

        return (
          <Stack py={2}>
            {status === "requested" ? (
              <HStack spacing={4}>
                <Text fontWeight="600" size="body.lg">
                  {name}
                </Text>
                <Tooltip label="We will reach out within 1 business day.">
                  <Badge
                    borderRadius="full"
                    size="label.sm"
                    variant="subtle"
                    px={3}
                    py={1.5}
                    colorScheme="black"
                  >
                    pending
                  </Badge>
                </Tooltip>
              </HStack>
            ) : (
              <>
                <Button
                  onClick={() => onClickConnect(id)}
                  variant="link"
                  colorScheme="blue"
                  w="fit-content"
                  rightIcon={<FiArrowRight />}
                  justifyContent="flex-start"
                >
                  {name}
                </Button>
                <Text size="body.sm" color="gray.700">
                  {url}
                </Text>
              </>
            )}
          </Stack>
        );
      },
    }),
  ];

  return (
    <>
      <TWTable
        title="engine instances"
        data={instances}
        columns={columns}
        isFetched={isFetched}
        isLoading={isLoading}
        onMenuClick={[
          {
            icon: BiPencil,
            text: "Edit",
            onClick: (instance) => {
              trackEvent({
                category: "engine",
                action: "edit",
                label: "open-modal",
              });
              setInstanceToUpdate(instance);
              editDisclosure.onOpen();
            },
          },
          {
            icon: FiTrash,
            text: "Remove",
            onClick: (instance) => {
              trackEvent({
                category: "engine",
                action: "remove",
                label: "open-modal",
              });
              setInstanceToUpdate(instance);
              removeDisclosure.onOpen();
            },
          },
        ]}
      />

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
    </>
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
                can import this Engine URL again later.
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
