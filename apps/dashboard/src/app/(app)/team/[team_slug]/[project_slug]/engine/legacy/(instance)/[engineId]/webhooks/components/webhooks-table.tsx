import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import {
  type EngineWebhook,
  useEngineDeleteWebhook,
  useEngineTestWebhook,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { MailQuestion, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, FormLabel, Text } from "tw-components";
import { shortenString } from "utils/usedapp-external";

export function beautifyString(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface WebhooksTableProps {
  instanceUrl: string;
  webhooks: EngineWebhook[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

const columnHelper = createColumnHelper<EngineWebhook>();

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
        <CopyTextButton
          textToCopy={cell.getValue() || ""}
          textToShow={shortenString(cell.getValue() || "")}
          tooltip="Secret"
          copyIconPosition="right"
        />
      );
    },
  }),
  columnHelper.accessor("url", {
    header: "URL",
    cell: (cell) => {
      const url = cell.getValue();
      return (
        <Text maxW={300} isTruncated>
          {url}
        </Text>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (cell) => {
      const value = cell.getValue();
      if (!value) {
        return;
      }

      const date = new Date(value);
      return (
        <Tooltip
          borderRadius="md"
          bg="transparent"
          boxShadow="none"
          label={
            <Card bgColor="backgroundHighlight">
              <Text>{format(date, "PP pp z")}</Text>
            </Card>
          }
          shouldWrapChildren
        >
          <Text>{formatDistanceToNowStrict(date, { addSuffix: true })}</Text>
        </Tooltip>
      );
    },
  }),
];

export const WebhooksTable: React.FC<WebhooksTableProps> = ({
  instanceUrl,
  webhooks,
  isPending,
  isFetched,
  authToken,
}) => {
  const [selectedWebhook, setSelectedWebhook] = useState<EngineWebhook>();
  const deleteDisclosure = useDisclosure();
  const testDisclosure = useDisclosure();

  const activeWebhooks = webhooks.filter((webhook) => webhook.active);

  return (
    <>
      <TWTable
        title="webhooks"
        data={activeWebhooks}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <MailQuestion className="size-4" />,
            text: "Test webhook",
            onClick: (row) => {
              setSelectedWebhook(row);
              testDisclosure.onOpen();
            },
          },
          {
            icon: <TrashIcon className="size-4" />,
            text: "Delete",
            onClick: (row) => {
              setSelectedWebhook(row);
              deleteDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedWebhook && deleteDisclosure.isOpen && (
        <DeleteWebhookModal
          webhook={selectedWebhook}
          disclosure={deleteDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
      {selectedWebhook && testDisclosure.isOpen && (
        <TestWebhookModal
          webhook={selectedWebhook}
          disclosure={testDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

interface DeleteWebhookModalProps {
  webhook: EngineWebhook;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}
function DeleteWebhookModal({
  webhook,
  disclosure,
  instanceUrl,
  authToken,
}: DeleteWebhookModalProps) {
  const deleteWebhook = useEngineDeleteWebhook({
    authToken,
    instanceUrl,
  });
  const trackEvent = useTrack();

  const onDelete = () => {
    const promise = deleteWebhook.mutateAsync(
      { id: webhook.id },
      {
        onSuccess: () => {
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "delete-webhook",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          trackEvent({
            category: "engine",
            action: "delete-webhook",
            label: "error",
            instance: instanceUrl,
            error,
          });
        },
      },
    );

    toast.promise(promise, {
      success: "Successfully deleted webhook.",
      error: "Failed to delete webhook.",
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Delete Webhook</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>Are you sure you want to delete this webhook?</Text>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Text>{webhook.name}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>URL</FormLabel>
              <Text>{webhook.url}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Created at</FormLabel>
              <Text>
                {format(new Date(webhook.createdAt ?? ""), "PP pp z")}
              </Text>
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Cancel
          </Button>
          <Button type="submit" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface TestWebhookModalProps {
  webhook: EngineWebhook;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}
function TestWebhookModal({
  webhook,
  disclosure,
  instanceUrl,
  authToken,
}: TestWebhookModalProps) {
  const { mutate: testWebhook, isPending } = useEngineTestWebhook({
    instanceUrl,
    authToken,
  });

  const [status, setStatus] = useState<number | undefined>();
  const [body, setBody] = useState<string | undefined>();

  const onTest = () => {
    testWebhook(
      { id: webhook.id },
      {
        onSuccess: (result) => {
          setStatus(result.status);
          setBody(result.body);
        },
      },
    );
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Test Webhook</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4 pb-2">
            <FormItem>
              <FormLabel>URL</FormLabel>
              <span className="font-mono">{webhook.url}</span>
            </FormItem>

            <Button type="submit" onClick={onTest} disabled={isPending}>
              {isPending && <Spinner className="mr-2 size-4" />}
              Send Request
            </Button>

            {status && (
              <div>
                <Badge variant={status <= 299 ? "success" : "destructive"}>
                  {status}
                </Badge>
              </div>
            )}
            <div className="max-h-[12rem] overflow-y-auto font-mono text-sm">
              {body ?? "Send a request to see the response."}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
