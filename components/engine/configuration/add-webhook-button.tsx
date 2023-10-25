import {
  CreateWebhookInput,
  useEngineCreateWebhook,
  useEngineWebhooksEventTypes,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Icon,
  FormControl,
  Input,
  Select,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormHelperText, FormLabel, Text } from "tw-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { beautifyString } from "./webhooks-table";

interface AddWebhookButtonProps {
  instance: string;
}

export const AddWebhookButton: React.FC<AddWebhookButtonProps> = ({
  instance,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createWebhook } = useEngineCreateWebhook(instance);
  const { data: webhookEventTypes } = useEngineWebhooksEventTypes(instance);
  const trackEvent = useTrack();
  const form = useForm<CreateWebhookInput>();

  const { onSuccess, onError } = useTxNotifications(
    "Webhook created successfully.",
    "Failed to create webhook.",
  );

  return (
    <>
      <Flex onClick={onOpen} alignItems="center" gap={2}>
        <Icon as={AiOutlinePlusCircle} boxSize={6} color="primary.500" />
        <Text color="primary.500" cursor="pointer" fontWeight="bold">
          Create Webhook
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            trackEvent({
              category: "engine",
              action: "create-webhook",
              label: "attempt",
              instance,
            });
            createWebhook(data, {
              onSuccess: () => {
                onSuccess();
                onClose();
                trackEvent({
                  category: "engine",
                  action: "create-webhook",
                  label: "success",
                  instance,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "engine",
                  action: "create-webhook",
                  label: "error",
                  instance,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>Create New Webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Event Type</FormLabel>
                <Select {...form.register("eventType", { required: true })}>
                  {webhookEventTypes?.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {beautifyString(eventType)}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  min={5}
                  type="text"
                  {...form.register("name", { required: true })}
                />
                <FormHelperText>Minimum 5 characters</FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>URL</FormLabel>
                <Input
                  type="url"
                  {...form.register("url", { required: true })}
                />
              </FormControl>
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
