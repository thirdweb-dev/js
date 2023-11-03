import { ApiKey, useUpdateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, HStack, useToast } from "@chakra-ui/react";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { useForm } from "react-hook-form";
import { ApiKeyValidationSchema, apiKeyValidationSchema } from "../validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromArrayToList, toArrFromList } from "utils/string";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";
import { ApiKeyHeader } from "../Header";
import { Button } from "tw-components";
import { EditGeneral } from "./General";
import { EditServices } from "./Services";

interface EditApiKeyProps {
  apiKey: ApiKey;
  onCancel: () => void;
}

export const EditApiKey: React.FC<EditApiKeyProps> = ({ apiKey, onCancel }) => {
  const { id, name, domains, bundleIds, redirectUrls, services } = apiKey;
  const mutation = useUpdateApiKey();
  const trackEvent = useTrack();
  const toast = useToast();

  const form = useForm<ApiKeyValidationSchema>({
    resolver: zodResolver(apiKeyValidationSchema),
    defaultValues: {
      name,
      domains: fromArrayToList(domains),
      bundleIds: fromArrayToList(bundleIds),
      redirectUrls: fromArrayToList(redirectUrls),
      services: SERVICES.map((srv) => {
        const existingService = (services || []).find(
          (s) => s.name === srv.name,
        );

        return {
          name: srv.name,
          targetAddresses: existingService
            ? fromArrayToList(existingService.targetAddresses)
            : "",
          enabled: !!existingService,
          actions: existingService?.actions || [],
          recoveryShareManagement: existingService?.recoveryShareManagement,
          customAuthentication: existingService?.customAuthentication
            ? {
                ...existingService.customAuthentication,
              }
            : undefined,
        };
      }),
    },
  });

  const { onSuccess, onError } = useTxNotifications(
    "API Key updated",
    "Failed to update an API Key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const enabledServices = (values.services || []).filter(
      (srv) => !!srv.enabled,
    );

    if (enabledServices.length > 0) {
      // validate embedded wallets custom auth
      const embeddedWallets = enabledServices.find(
        (s) => s.name === "embeddedWallets",
      );

      if (embeddedWallets) {
        const { customAuthentication, recoveryShareManagement } =
          embeddedWallets;
        if (
          recoveryShareManagement === "USER_MANAGED" &&
          (!customAuthentication?.aud.length ||
            !customAuthentication?.jwksUri.length)
        ) {
          return toast({
            title: "Custom JSON Web Token configuration is invalid",
            description:
              "To use Embedded Wallets with Custom JSON Web Token, provide JWKS URI and AUD.",
            position: "bottom",
            variant: "solid",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }

      const formattedValues = {
        id,
        name: values.name,
        domains: toArrFromList(values.domains),
        bundleIds: toArrFromList(values.bundleIds),
        redirectUrls: toArrFromList(values.redirectUrls, true),
        services: (values.services || [])
          .filter((srv) => srv.enabled)
          .map((srv) => ({
            ...srv,
            targetAddresses: toArrFromList(srv.targetAddresses),
          })),
      };

      trackEvent({
        category: "api-keys",
        action: "edit",
        label: "attempt",
      });

      mutation.mutate(formattedValues, {
        onSuccess: () => {
          onSuccess();
          onCancel();
          trackEvent({
            category: "api-keys",
            action: "edit",
            label: "success",
          });
        },
        onError: (err) => {
          onError(err);
          trackEvent({
            category: "api-keys",
            action: "edit",
            label: "error",
            error: err,
          });
        },
      });
    } else {
      toast({
        title: "Service not selected",
        description: "Choose at least one service for your API Key access.",
        position: "bottom",
        variant: "solid",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  });

  const actions = (
    <>
      <Button type="button" variant="outline" onClick={onCancel} minW={20}>
        Cancel
      </Button>
      <Button
        type="submit"
        colorScheme="primary"
        minW={20}
        isDisabled={!form.formState.isDirty}
      >
        Save
      </Button>
    </>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      autoComplete="off"
    >
      <Flex flexDir="column" gap={10}>
        <ApiKeyHeader apiKey={apiKey} actions={actions} />

        <Flex flexDir="column" gap={10}>
          <EditGeneral form={form} />
          <EditServices form={form} />

          <HStack gap={3} alignSelf="flex-end">
            {actions}
          </HStack>
        </Flex>
      </Flex>
    </form>
  );
};
