import {
  PaymentsWebhooksType,
  usePaymentsUpdateWebhook,
} from "@3rdweb-sdk/react/hooks/usePayments";
import {
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Button, FormLabel, Text, FormErrorMessage } from "tw-components";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";
import { useForm } from "react-hook-form";

export interface PaymentsWebhooksTableProps {
  accountId: string;
  webhooks: PaymentsWebhooksType[];
  isLoading: boolean;
  isFetched: boolean;
}

const isValidUrl = (value: string) => {
  return /^https:\/\/[^\s$.?#].[^\s]*$/gm.test(value);
};

const columnHelper = createColumnHelper<PaymentsWebhooksType>();

const columns = [
  columnHelper.accessor("url", {
    header: "Url",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
];

export const PaymentsWebhooksTable: React.FC<PaymentsWebhooksTableProps> = ({
  accountId,
  webhooks,
  isLoading,
  isFetched,
}) => {
  const trackEvent = useTrack();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: updateWebhook } = usePaymentsUpdateWebhook(accountId);
  const form = useForm<PaymentsWebhooksType & { isDelete: boolean }>();

  const onDelete = (webhook: PaymentsWebhooksType) => {
    form.reset({
      ...webhook,
      isDelete: true,
    });
    onOpen();
  };
  const onEdit = (webhook: PaymentsWebhooksType) => {
    form.reset({
      ...webhook,
      isDelete: false,
    });
    onOpen();
  };

  const { onSuccess: onDeleteSuccess, onError: onDeleteError } =
    useTxNotifications(
      "Webhook deleted successfully.",
      "Failed to delete webhook.",
    );

  const { onSuccess: onEditSuccess, onError: onEditError } = useTxNotifications(
    "Webhook updated successfully",
    "Failed to update webhook.",
  );
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        {form.watch("isDelete") ? (
          <ModalContent
            as="form"
            onSubmit={form.handleSubmit((data) => {
              trackEvent({
                category: "payments",
                action: "delete-webhook",
                label: "attempt",
                accountId,
              });

              updateWebhook(
                {
                  webhookId: data.id,
                  deletedAt: new Date(),
                },
                {
                  onSuccess: () => {
                    onDeleteSuccess();
                    onClose();
                    form.reset();
                    trackEvent({
                      category: "payments",
                      action: "delete-webhook",
                      label: "success",
                      accountId,
                    });
                  },
                  onError: (error) => {
                    onDeleteError(error);
                    trackEvent({
                      category: "payments",
                      action: "delete-webhook",
                      label: "error",
                      accountId,
                    });
                  },
                },
              );
            })}
          >
            <ModalHeader>Delete webhook</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack gap={4}>
                <Text>Are you sure you want to delete this webook?</Text>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Text>
                    {form.watch("isProduction") ? "Mainnet" : "Testnet"}
                  </Text>
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Text>{form.watch("url")}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Created at</FormLabel>
                  <Text>
                    {format(new Date(form.watch("createdAt")), "PP pp z")}
                  </Text>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter as={Flex} gap={3}>
              <Button type="button" onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" colorScheme="red">
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent
            as="form"
            onSubmit={form.handleSubmit((data) => {
              trackEvent({
                category: "payments",
                action: "update-webhook",
                label: "attempt",
                accountId,
              });
              updateWebhook(
                {
                  webhookId: data.id,
                  url: data.url,
                },
                {
                  onSuccess: () => {
                    onEditSuccess();
                    onClose();
                    form.reset();
                    trackEvent({
                      category: "payments",
                      action: "update-webhook",
                      label: "success",
                      accountId,
                    });
                  },
                  onError: (error) => {
                    onEditError(error);
                    trackEvent({
                      category: "payments",
                      action: "update-webhook",
                      label: "error",
                      accountId,
                      error,
                    });
                  },
                },
              );
            })}
          >
            <ModalHeader>Update Webhook</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir="column" gap={4}>
                <FormControl isRequired>
                  <FormControl>
                    <FormLabel>Environment</FormLabel>
                    <Text>
                      {form.watch("isProduction") ? "Mainnet" : "Testnet"}
                    </Text>
                  </FormControl>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={!!form.getFieldState("url", form.formState).error}
                >
                  <FormLabel>URL</FormLabel>
                  <Input
                    type="url"
                    placeholder="Webhook URL"
                    {...form.register("url", {
                      required: "URL is required",
                      validate: {
                        validUrl: (value) =>
                          isValidUrl(value) ||
                          `Invalid URL, make sure you include https://`,
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {form.formState.errors?.url?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter as={Flex} gap={3}>
              <Button type="button" onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" colorScheme="primary">
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
      <TWTable
        title="webhooks"
        data={webhooks}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  );
};
