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
import { Button } from "chakra/button";
import { FormLabel } from "chakra/form";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type CreateWebhookInput,
  useEngineCreateWebhook,
} from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { beautifyString } from "./webhooks-table";

interface AddWebhookButtonProps {
  instanceUrl: string;
  authToken: string;
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
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createWebhook } = useEngineCreateWebhook({
    authToken,
    instanceUrl,
  });

  const form = useForm<CreateWebhookInput>();

  const { onSuccess, onError } = useTxNotifications(
    "Webhook created successfully.",
    "Failed to create webhook.",
  );

  return (
    <>
      <Button
        colorScheme="primary"
        leftIcon={<CirclePlusIcon className="size-6" />}
        onClick={onOpen}
        size="sm"
        variant="ghost"
        w="fit-content"
      >
        Create Webhook
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          className="!bg-background rounded-lg border border-border"
          onSubmit={form.handleSubmit((data) => {
            createWebhook(data, {
              onError: (error) => {
                onError(error);
                console.error(error);
              },
              onSuccess: () => {
                onSuccess();
                onClose();
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
                  placeholder="My webhook"
                  type="text"
                  {...form.register("name", { required: true })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>URL</FormLabel>
                <Input
                  placeholder="https://"
                  type="url"
                  {...form.register("url", { required: true })}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="primary" type="submit">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
