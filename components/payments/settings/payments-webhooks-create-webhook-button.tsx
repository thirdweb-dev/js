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
  Tooltip,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormLabel, FormErrorMessage, Card, Text } from "tw-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  CreateWebhookInput,
  usePaymentsCreateWebhook,
} from "@3rdweb-sdk/react/hooks/usePayments";

export interface PaymentsWebhooksCreateButtonProps {
  accountId: string;
  isMainnets: boolean;
  isDisabled: boolean;
}

const isValidUrl = (value: string) => {
  return /^https:\/\/[^\s$.?#].[^\s]*$/gm.test(value);
};

export const PaymentsWebhooksCreateButton: React.FC<
  PaymentsWebhooksCreateButtonProps
> = ({ isMainnets, accountId, isDisabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createWebhook } = usePaymentsCreateWebhook(accountId);
  const trackEvent = useTrack();

  const form = useForm<CreateWebhookInput>({
    defaultValues: {
      isProduction: isMainnets,
    },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Webhook created successfully.",
    "Failed to create webhook.",
  );

  const createTitle = `Create ${isMainnets ? "Mainnets" : "Testnets"} Webhook`;

  return (
    <>
      <Tooltip
        p={0}
        bg="transparent"
        boxShadow="none"
        label={
          isDisabled ? (
            <Card py={2} px={4} bgColor="backgroundHighlight">
              <Text>
                You have reached the maximum number of webhooks for{" "}
                {isMainnets ? "Mainnets" : "Testnets"}.
              </Text>
            </Card>
          ) : undefined
        }
        borderRadius="lg"
        placement="auto-end"
      >
        <Button
          onClick={onOpen}
          variant="ghost"
          size="sm"
          leftIcon={<Icon as={AiOutlinePlusCircle} boxSize={6} />}
          colorScheme="primary"
          w="fit-content"
          isDisabled={isDisabled}
        >
          Create Webhook
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            trackEvent({
              category: "payments",
              action: "create-webhook",
              label: "attempt",
              accountId,
            });
            createWebhook(data, {
              onSuccess: () => {
                onSuccess();
                onClose();
                form.reset();
                trackEvent({
                  category: "payments",
                  action: "create-webhook",
                  label: "success",
                  accountId,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "payments",
                  action: "create-webhook",
                  label: "error",
                  accountId,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>{createTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={4}>
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
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
