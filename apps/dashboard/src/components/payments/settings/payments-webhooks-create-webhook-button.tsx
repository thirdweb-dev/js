import {
  type CreateWebhookInput,
  type PaymentsWebhooksType,
  usePaymentsCreateWebhook,
} from "@3rdweb-sdk/react/hooks/usePayments";
import {
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Button, Card, FormErrorMessage, FormLabel, Text } from "tw-components";

interface PaymentsWebhooksCreateButtonProps {
  paymentsSellerId: string;
  existingWebhooks: PaymentsWebhooksType[];
  isMainnets: boolean;
  isDisabled: boolean;
}

const isValidUrl = (value: string) => {
  return /^https:\/\/[^\s$.?#].[^\s]*$/gm.test(value);
};

export const PaymentsWebhooksCreateButton: React.FC<
  PaymentsWebhooksCreateButtonProps
> = ({ paymentsSellerId, existingWebhooks, isMainnets, isDisabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: createWebhook } = usePaymentsCreateWebhook(paymentsSellerId);
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

  const existingUrls = useMemo(() => {
    return existingWebhooks.map((val) => val.url);
  }, [existingWebhooks]);

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
              paymentsSellerId,
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
                  paymentsSellerId,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "payments",
                  action: "create-webhook",
                  label: "error",
                  paymentsSellerId,
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
                      checkUrl: (value) =>
                        isValidUrl(value) ||
                        "Invalid URL, make sure you include https://",
                      checkDuplicate: (value) =>
                        !existingUrls.includes(value) ||
                        "Invalid URL, webhook already exists",
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
