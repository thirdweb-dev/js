import {
  type EditEngineInstanceInput,
  type EngineInstance,
  type RemoveCloudHostedInput,
  useEngineEditInstance,
  type useEngineInstances,
  useEngineRemoveCloudHosted,
  useEngineRemoveFromDashboard,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Tooltip,
  type UseDisclosureReturn,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { FiArrowRight, FiTrash } from "react-icons/fi";
import { useActiveAccount } from "thirdweb/react";
import { Badge, Button, FormLabel, Heading, Text } from "tw-components";

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
  const token = useLoggedInUser().user?.jwt ?? null;
  const address = useActiveAccount()?.address;
  const toast = useToast();

  const [instanceToUpdate, setInstanceToUpdate] = useState<
    EngineInstance | undefined
  >();

  const { mutate: connectToInstance } = useMutation({
    mutationFn: async (instance: EngineInstance) => {
      // Make an authed request.
      // If it fails to fetch, the server is unreachable.
      // If it returns a 401, the user is not a valid admin.
      const res = await fetch(`${instance.url}auth/permissions/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        return instance;
      }
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(`Unexpected status code ${res.status}`);
    },
    onSuccess: (instance) => {
      trackEvent({
        category: "engine",
        action: "connect",
        label: "success",
      });
      setConnectedInstance(instance);
    },
    onError: (error, instance) => {
      const e = error as Error;
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
      } else if (e?.message.indexOf("Unauthorized") > -1) {
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
        toast({
          status: "error",
          description:
            "There was an unexpected error reaching your Engine instance. Try again or contact us if this issue persists.",
          duration: null,
          isClosable: true,
        });
      }
    },
  });

  const columnHelper = createColumnHelper<EngineInstance>();
  const columns = [
    columnHelper.accessor("id", {
      header: "Engine Instances",
      cell: (cell) => {
        const { id, name, url, status } = cell.row.original;

        let badge: ReactNode | undefined;
        if (status === "requested") {
          badge = (
            <Tooltip label="Deployment will begin shortly.">
              <Badge
                borderRadius="full"
                size="label.sm"
                variant="subtle"
                px={3}
                py={1.5}
                colorScheme="yellow"
              >
                Pending
              </Badge>
            </Tooltip>
          );
        } else if (status === "deploying") {
          badge = (
            <Tooltip label="This step may take up to 30 minutes.">
              <Badge
                borderRadius="full"
                size="label.sm"
                variant="subtle"
                px={3}
                py={1.5}
                colorScheme="green"
              >
                Deploying
              </Badge>
            </Tooltip>
          );
        } else if (status === "paymentFailed") {
          badge = (
            <Tooltip label="There was an error charging your payment method. Please contact support@thirdweb.com.">
              <Badge
                borderRadius="full"
                size="label.sm"
                variant="subtle"
                px={3}
                py={1.5}
                colorScheme="red"
              >
                Payment Failed
              </Badge>
            </Tooltip>
          );
        }

        return (
          <Stack py={2}>
            {badge ? (
              <HStack spacing={4}>
                <Text fontWeight="600" size="body.lg">
                  {name}
                </Text>
                {badge}
              </HStack>
            ) : (
              <>
                <Button
                  onClick={() => {
                    const instance = instances.find((i) => i.id === id);
                    if (instance) {
                      connectToInstance(instance);
                    }
                  }}
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
            isDestructive: true,
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
  const { mutate: editInstance } = useEngineEditInstance();
  const { onClose } = disclosure;

  const form = useForm<EditEngineInstanceInput>({
    defaultValues: {
      instanceId: instance.id,
      name: instance.name,
      url: instance.url,
    },
  });

  return (
    <Modal isOpen onClose={onClose} isCentered size="lg">
      <ModalOverlay />

      <ModalContent>
        <form
          onSubmit={form.handleSubmit((data) =>
            editInstance(data, {
              onSuccess: () => {
                toast({
                  status: "success",
                  description: "Successfully updated this Engine.",
                });
                refetch();
                onClose();
              },
              onError: () => {
                toast({
                  status: "error",
                  description: "Error updating this Engine.",
                });
              },
            }),
          )}
        >
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
  const { mutate: removeFromDashboard } = useEngineRemoveFromDashboard();
  const { mutate: removeCloudHosted } = useEngineRemoveCloudHosted();
  const { onClose } = disclosure;

  const form = useForm<RemoveCloudHostedInput>({
    defaultValues: {
      instanceId: instance.id,
    },
  });

  return (
    <Modal isOpen onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        {instance.status === "paymentFailed" ||
        (instance.status === "active" && !instance.cloudDeployedAt) ? (
          <>
            <ModalHeader>Remove Engine Instance</ModalHeader>

            <ModalBody as={Flex} flexDir="column" gap={2}>
              <Text>
                Are you sure you want to remove{" "}
                <strong>{instance?.name}</strong> from your dashboard?
              </Text>
              <Text>
                This action does not modify your Engine infrastructure. You can
                re-add it at any time.
              </Text>
            </ModalBody>

            <ModalFooter as={Flex} gap={3}>
              <Button onClick={onClose} variant="ghost">
                Close
              </Button>
              <Button
                onClick={() => {
                  removeFromDashboard(instance.id, {
                    onSuccess: () => {
                      toast({
                        status: "success",
                        description:
                          "Removed an Engine instance from your dashboard.",
                      });
                      refetch();
                      onClose();
                    },
                    onError: () => {
                      toast({
                        status: "error",
                        description:
                          "Error removing an Engine instance from your dashboard.",
                      });
                    },
                  });
                }}
                colorScheme="red"
              >
                Remove
              </Button>
            </ModalFooter>
          </>
        ) : (
          <form
            onSubmit={form.handleSubmit((data) =>
              removeCloudHosted(data, {
                onSuccess: () => {
                  toast({
                    status: "success",
                    description:
                      "Submitted a request to cancel your Engine subscription. This may take up to 2 business days.",
                  });
                  refetch();
                  onClose();
                },
                onError: () => {
                  toast({
                    status: "error",
                    description:
                      "Error requesting to cancel your Engine subscription.",
                  });
                },
              }),
            )}
          >
            <ModalHeader>Cancel Engine Subscription</ModalHeader>

            <ModalBody as={Stack} gap={4}>
              <Text>
                Complete this form to request to cancel your Engine
                subscription. This may take up to 2 business days.
              </Text>

              {/* Form */}
              <FormControl>
                <FormLabel>
                  Please share any feedback to help us improve
                </FormLabel>
                <RadioGroup>
                  <Stack>
                    <Radio
                      value="USING_SELF_HOSTED"
                      {...form.register("reason", { required: true })}
                    >
                      <Text>Migrating to self-hosted</Text>
                    </Radio>
                    <Radio
                      value="TOO_EXPENSIVE"
                      {...form.register("reason", { required: true })}
                    >
                      <Text>Too expensive</Text>
                    </Radio>
                    <Radio
                      value="MISSING_FEATURES"
                      {...form.register("reason", { required: true })}
                    >
                      <Text>Missing features</Text>
                    </Radio>
                    <Radio
                      value="OTHER"
                      {...form.register("reason", { required: true })}
                    >
                      <Text>Other</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <Textarea
                  placeholder="Provide additional feedback"
                  mt={2}
                  {...form.register("feedback")}
                />
              </FormControl>

              <Alert status="warning" variant="left-accent">
                <Flex direction="column" gap={2}>
                  <Heading as={AlertTitle} size="label.md">
                    This action is irreversible!
                  </Heading>
                  <Text as={AlertDescription} size="body.md">
                    You will no longer be able to access this Engine&apos;s
                    local backend wallets.{" "}
                    <strong>Any remaining mainnet funds will be lost.</strong>
                  </Text>
                </Flex>
              </Alert>
            </ModalBody>

            <ModalFooter as={Flex} gap={3}>
              <Button onClick={onClose} variant="ghost">
                Close
              </Button>
              <Button
                type="submit"
                colorScheme="primary"
                isDisabled={!form.formState.isValid}
              >
                Request to cancel
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
