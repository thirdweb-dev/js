import {
  type CreateWebhookInput,
  useEngineCreateWebhook,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, FormLabel } from "tw-components";
import { beautifyString } from "./webhooks-table";

interface AddWebhookButtonProps {
  instanceUrl: string;
  authToken: string;
  supportedWebhookConfig: boolean;
}

const WEBHOOK_EVENT_TYPES = [
  "all_transactions",
  "sent_transaction",
  "mined_transaction",
  "errored_transaction",
  "cancelled_transaction",
  "backend_wallet_balance",
  "auth",
];

export const AddWebhookButton: React.FC<AddWebhookButtonProps> = ({
  instanceUrl,
  authToken,
  supportedWebhookConfig = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createWebhook } = useEngineCreateWebhook({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();
  const form = useForm<CreateWebhookInput>();

  const { onSuccess, onError } = useTxNotifications(
    "Webhook created successfully.",
    "Failed to create webhook.",
  );

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
        size="sm"
        leftIcon={<CirclePlusIcon className="size-6" />}
        colorScheme="primary"
        w="fit-content"
      >
        Create Webhook
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          className="!bg-background rounded-lg border border-border"
          as="form"
          onSubmit={form.handleSubmit((data) => {
            let finalData: CreateWebhookInput = data;

            if (supportedWebhookConfig) {
              const { config, ..._data } = data;
              finalData = _data;
              if (config) {
                try {
                  finalData.config = JSON.parse(config);
                } catch (_) {
                  toast.error("Config must be a valid json string");
                  return;
                }
              }
            }

            createWebhook(finalData, {
              onSuccess: () => {
                onSuccess();
                onClose();
                trackEvent({
                  category: "engine",
                  action: "create-webhook",
                  label: "success",
                  instance: instanceUrl,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "engine",
                  action: "create-webhook",
                  label: "error",
                  instance: instanceUrl,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>Create Webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Event Type</FormLabel>
                <Select {...form.register("eventType", { required: true })}>
                  {WEBHOOK_EVENT_TYPES.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {beautifyString(eventType)}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="My webhook"
                  {...form.register("name", { required: true })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>URL</FormLabel>
                <Input
                  type="url"
                  placeholder="https://"
                  {...form.register("url", { required: true })}
                />
              </FormControl>
              {supportedWebhookConfig && (
                <FormControl>
                  <FormLabel>Config</FormLabel>
                  <Input
                    type="text"
                    placeholder={`{"address": "0x1234...5678", "chainId": 1, "threshold": 200.5}`}
                    {...form.register("config")}
                  />
                </FormControl>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
