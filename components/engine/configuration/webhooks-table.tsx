import {
  Webhook,
  useEngineRevokeWebhook,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Button, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

export function beautifyString(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface WebhooksTableProps {
  instance: string;
  webhooks: Webhook[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<Webhook>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("eventType", {
    header: "Event Type",
    cell: (cell) => {
      return <Text>{beautifyString(cell.getValue())}</Text>;
    },
  }),
  columnHelper.accessor("secret", {
    header: "Secret",
    cell: (cell) => {
      return (
        <AddressCopyButton address={cell.getValue() || ""} title="secret" />
      );
    },
  }),
  columnHelper.accessor("url", {
    header: "URL",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (cell) => {
      const value = cell.getValue();
      if (!value) {
        return;
      }
      return <Text>{format(new Date(value), "PP p")}</Text>;
    },
  }),
];

export const WebhooksTable: React.FC<WebhooksTableProps> = ({
  instance,
  webhooks,
  isLoading,
  isFetched,
}) => {
  const [webhookToRevoke, setWebhookToRevoke] = useState<Webhook>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: revokeWebhook } = useEngineRevokeWebhook(instance);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed webhook",
    "Failed to remove webhook",
  );

  const onDelete = (webhook: Webhook) => {
    setWebhookToRevoke(webhook);
    onOpen();
  };

  const onRevoke = () => {
    if (!webhookToRevoke) {
      return;
    }
    trackEvent({
      category: "engine",
      action: "revoke-webhook",
      label: "attempt",
      instance,
    });
    revokeWebhook(
      {
        id: webhookToRevoke.id,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          trackEvent({
            category: "engine",
            action: "revoke-webhook",
            label: "success",
            instance,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-webhook",
            label: "error",
            instance,
            error,
          });
        },
      },
    );
  };

  const activeWebhooks = webhooks.filter((webhook) => webhook.active);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to remove webook with name{" "}
              {webhookToRevoke?.name}?
            </Text>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="red" onClick={onRevoke}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TWTable
        title="webhooks"
        data={activeWebhooks}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onDelete={(webhook) => onDelete(webhook)}
      />
    </>
  );
};
