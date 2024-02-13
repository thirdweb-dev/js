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
import { format } from "date-fns/format";
import { Button, FormLabel, Text, FormErrorMessage } from "tw-components";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";
import { useForm } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";

export interface PaymentsWebhooksTableProps {
  paymentsSellerId: string;
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
  paymentsSellerId,
  webhooks,
  isLoading,
  isFetched,
}) => {
  const trackEvent = useTrack();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: updateWebhook } = usePaymentsUpdateWebhook(paymentsSellerId);
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

  const isDelete = form.watch("isDelete");

  const onSuccess = isDelete ? onDeleteSuccess : onEditSuccess;
  const onError = isDelete ? onDeleteError : onEditError;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            const isSubmitDelete = data.isDelete;

            trackEvent({
              category: "payments",
              action: `${isDelete ? "delete" : "update"}-webhook`,
              label: "attempt",
              paymentsSellerId,
            });

            updateWebhook(
              {
                webhookId: data.id,
                ...(isSubmitDelete
                  ? { deletedAt: new Date() }
                  : { url: data.url }),
              },
              {
                onSuccess: () => {
                  onSuccess();
                  onClose();
                  form.reset();
                  trackEvent({
                    category: "payments",
                    action: `${isSubmitDelete ? "delete" : "update"}-webhook`,
                    label: "success",
                    paymentsSellerId,
                  });
                },
                onError: (error) => {
                  onError(error);
                  trackEvent({
                    category: "payments",
                    action: `${isSubmitDelete ? "delete" : "update"}-webhook`,
                    label: "error",
                    paymentsSellerId,
                  });
                },
              },
            );
          })}
        >
          <ModalHeader>
            {`${isDelete ? "Delete" : "Update"}`}{" "}
            {form.watch("isProduction") ? "Mainnets" : "Testnets"} Webhook
          </ModalHeader>
          <ModalCloseButton />
          {isDelete ? (
            <ModalBody>
              <Stack gap={4}>
                <Text>Are you sure you want to delete this Webhook?</Text>
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
          ) : (
            <ModalBody
              as={FormControl}
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
            </ModalBody>
          )}
          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme={isDelete ? "red" : "primary"}>
              {isDelete ? "Delete" : "Update"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TWTable
        title="webhooks"
        data={webhooks}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: BiPencil,
            text: "Edit",
            onClick: onEdit,
          },
          {
            icon: FiTrash,
            text: "Delete",
            onClick: onDelete,
            isDestructive: true,
          },
        ]}
      />
    </>
  );
};
