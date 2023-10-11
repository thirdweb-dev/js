import { zodResolver } from "@hookform/resolvers/zod";
import { ApiKeysCreateModal } from "./CreateKeyModal";
import { toastMessages } from "./messages";
import { apiKeyValidationSchema, ApiKeyValidationSchema } from "./validations";
import { ApiKey, useCreateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Icon, useDisclosure, useToast } from "@chakra-ui/react";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";
import { toArrFromList } from "utils/string";

export const CreateApiKeyButton: React.FC = () => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [apiKey, setApiKey] = useState<ApiKey | null>(null);

  const form = useForm<ApiKeyValidationSchema>({
    resolver: zodResolver(apiKeyValidationSchema),
    values: {
      name: "",
      domains: "",
      bundleIds: "",
      redirectUrls: "",
      // FIXME: Enable when wallets restrictions is in use
      // walletAddresses: "*",
      services: SERVICES.map((srv) => {
        return {
          name: srv.name,
          targetAddresses: "",
          enabled: true,
          actions: srv.actions.map((sa) => sa.name),
        };
      }),
    },
  });

  const createKeyMutation = useCreateApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API key created",
    "Failed to create API key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const enabledServices = (values.services || []).filter(
      (srv) => !!srv.enabled,
    );

    if (enabledServices.length > 0) {
      const formattedValues = {
        name: values.name,
        domains: toArrFromList(values.domains),
        bundleIds: toArrFromList(values.bundleIds),
        redirectUrls: toArrFromList(values.redirectUrls, true),
        // FIXME: Enable when wallets restrictions is in use
        // walletAddresses: toArrFromList(values.walletAddresses),
        services: (values.services || [])
          .filter((srv) => srv.enabled)
          .map((srv) => ({
            ...srv,
            targetAddresses: toArrFromList(srv.targetAddresses),
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
    } else {
      toast(toastMessages.updateServices);
    }
  });

  const handleClose = () => {
    setApiKey(null);
    form.reset();
    onClose();
  };

  return (
    <>
      <ApiKeysCreateModal
        apiKey={apiKey}
        form={form}
        open={isOpen}
        isLoading={createKeyMutation.isLoading}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <Button
        onClick={onOpen}
        colorScheme="blue"
        leftIcon={<Icon as={FiPlus} boxSize={4} />}
        isLoading={createKeyMutation.isLoading}
        isDisabled={createKeyMutation.isLoading}
      >
        Create API Key
      </Button>
    </>
  );
};
