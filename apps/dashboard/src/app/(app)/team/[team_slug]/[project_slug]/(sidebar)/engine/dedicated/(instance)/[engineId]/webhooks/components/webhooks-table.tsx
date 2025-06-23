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
import { Card } from "chakra/card";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { format, formatDistanceToNowStrict } from "date-fns";
import { MailQuestionIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TWTable } from "@/components/blocks/TWTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type EngineWebhook,
  useEngineDeleteWebhook,
  useEngineTestWebhook,
} from "@/hooks/useEngine";
import { shortenString } from "@/utils/usedapp-external";

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
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
    header: "Name",
  }),
  columnHelper.accessor("eventType", {
    cell: (cell) => {
      return <Text>{beautifyString(cell.getValue())}</Text>;
    },
    header: "Event Type",
  }),
  columnHelper.accessor("secret", {
    cell: (cell) => {
      return (
        <CopyTextButton
          copyIconPosition="right"
          textToCopy={cell.getValue() || ""}
          textToShow={shortenString(cell.getValue() || "")}
          tooltip="Secret"
        />
      );
    },
    header: "Secret",
  }),
  columnHelper.accessor("url", {
    cell: (cell) => {
      const url = cell.getValue();
      return (
        <Text isTruncated maxW={300}>
          {url}
        </Text>
      );
    },
    header: "URL",
  }),
  columnHelper.accessor("createdAt", {
    cell: (cell) => {
      const value = cell.getValue();
      if (!value) {
        return;
      }

      const date = new Date(value);
      return (
        <Tooltip
          bg="transparent"
          borderRadius="md"
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
    header: "Created At",
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
        columns={columns}
        data={activeWebhooks}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <MailQuestionIcon className="size-4" />,
            onClick: (row) => {
              setSelectedWebhook(row);
              testDisclosure.onOpen();
            },
            text: "Test webhook",
          },
          {
            icon: <TrashIcon className="size-4" />,
            isDestructive: true,
            onClick: (row) => {
              setSelectedWebhook(row);
              deleteDisclosure.onOpen();
            },
            text: "Delete",
          },
        ]}
        title="webhooks"
      />

      {selectedWebhook && deleteDisclosure.isOpen && (
        <DeleteWebhookModal
          authToken={authToken}
          disclosure={deleteDisclosure}
          instanceUrl={instanceUrl}
          webhook={selectedWebhook}
        />
      )}
      {selectedWebhook && testDisclosure.isOpen && (
        <TestWebhookModal
          authToken={authToken}
          disclosure={testDisclosure}
          instanceUrl={instanceUrl}
          webhook={selectedWebhook}
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

  const onDelete = () => {
    const promise = deleteWebhook.mutateAsync(
      { id: webhook.id },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          disclosure.onClose();
        },
      },
    );

    toast.promise(promise, {
      error: "Failed to delete webhook.",
      success: "Successfully deleted webhook.",
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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
          <Button onClick={onDelete} type="submit" variant="destructive">
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
    authToken,
    instanceUrl,
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
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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

            <Button disabled={isPending} onClick={onTest} type="submit">
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
