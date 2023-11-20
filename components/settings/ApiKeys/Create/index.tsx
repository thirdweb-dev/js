import { zodResolver } from "@hookform/resolvers/zod";
import {
  apiKeyCreateValidationSchema,
  ApiKeyCreateValidationSchema,
} from "../validations";
import { ApiKey, useCreateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { SERVICES } from "@thirdweb-dev/service-utils";
import {
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { Button, ButtonProps, Checkbox, Text } from "tw-components";
import { toArrFromList } from "utils/string";
import { CreateGeneral } from "./General";
import { CreateKeys } from "./Keys";
import Message from "../message";

interface CreateAPIKeyButtonProps {
  buttonProps?: ButtonProps;
}

export const CreateApiKeyButton: React.FC<CreateAPIKeyButtonProps> = ({
  buttonProps,
}) => {
  const [step, setStep] = useState<"create" | "domainsAlert" | "keys">(
    "create",
  );
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [secretStored, setSecretStored] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackEvent = useTrack();

  const form = useForm<ApiKeyCreateValidationSchema>({
    resolver: zodResolver(apiKeyCreateValidationSchema),
    defaultValues: {
      name: "",
      domains: "",
    },
  });

  const noDomains = step === "domainsAlert" && !form.watch("domains");
  const anyDomain = step === "domainsAlert" && form.watch("domains") === "*";

  const createKeyMutation = useCreateApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API key created",
    "Failed to create API key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const formattedValues = {
      name: values.name,
      domains: toArrFromList(values.domains),
      // enable all services
      services: SERVICES.map((srv) => ({
        name: srv.name,
        targetAddresses: ["*"],
        enabled: true,
        actions: srv.actions.map((sa) => sa.name),
        recoveryShareManagement: "AWS_MANAGED",
        customAuthentication: undefined,
        applicationName: srv.name,
      })),
    };

    trackEvent({
      category: "api-keys",
      action: "create",
      label: "attempt",
    });

    createKeyMutation.mutate(formattedValues, {
      onSuccess: (data) => {
        onSuccess();
        setApiKey(data);
        setStep("keys");

        trackEvent({
          category: "api-keys",
          action: "create",
          label: "success",
        });
      },
      onError: (err) => {
        onError(err);
        trackEvent({
          category: "api-keys",
          action: "create",
          label: "error",
          error: err,
        });
      },
    });
  });

  const handleClose = () => {
    if (step !== "create") {
      return;
    }
    onClose();
    form.reset();
  };

  const handleNext = async () => {
    if (step === "create") {
      await form.trigger();

      if (form.formState.isValid) {
        const domains = form.getValues("domains");
        if (!domains || domains === "*") {
          setStep("domainsAlert");
        } else {
          handleSubmit();
        }
      }
    } else if (step === "domainsAlert") {
      handleSubmit();
    } else {
      setApiKey(null);
      form.reset();
      onClose();
      setStep("create");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalHeader>
              {step === "create" && "Create an API Key"}
              {noDomains && Message.NoDomainsTitle}
              {anyDomain && Message.AnyDomainTitle}
              {step === "keys" && apiKey?.name}
            </ModalHeader>

            {step === "create" && <ModalCloseButton />}

            <ModalBody>
              {step === "create" && <CreateGeneral form={form} />}
              {noDomains && <Text>{Message.NoDomainsDescription}</Text>}
              {anyDomain && <Text>{Message.AnyDomainDescription}</Text>}
              {step === "keys" && (
                <CreateKeys
                  apiKey={apiKey as ApiKey}
                  isLoading={createKeyMutation.isLoading}
                />
              )}
            </ModalBody>
            <ModalFooter gap={4}>
              <Flex flexDir="column" gap={4} w="full">
                {step === "keys" && (
                  <HStack>
                    <Checkbox
                      isChecked={secretStored}
                      onChange={(e) => setSecretStored(e.target.checked)}
                    >
                      <Text>
                        I confirm that I&apos;ve securely stored my secret key
                      </Text>
                    </Checkbox>
                  </HStack>
                )}
                <HStack
                  justifyContent={
                    step === "domainsAlert" ? "space-between" : "flex-end"
                  }
                  w="full"
                >
                  {step === "domainsAlert" && (
                    <Button variant="outline" onClick={() => setStep("create")}>
                      Back
                    </Button>
                  )}
                  <Button
                    colorScheme="blue"
                    type="button"
                    onClick={handleNext}
                    isLoading={createKeyMutation.isLoading}
                    isDisabled={
                      createKeyMutation.isLoading ||
                      (step === "keys" && !secretStored)
                    }
                  >
                    {step === "domainsAlert"
                      ? "Proceed"
                      : step === "create"
                      ? "Next"
                      : "Complete"}
                  </Button>
                </HStack>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Button
        {...buttonProps}
        onClick={onOpen}
        colorScheme="blue"
        leftIcon={<Icon as={FiPlus} boxSize={4} />}
      >
        Create API Key
      </Button>
    </>
  );
};
