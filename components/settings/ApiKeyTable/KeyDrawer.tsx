import { ApiKeyDetails } from "./Details";
import { ApiKeyForm } from "./KeyForm";
import { RevokeApiKeyButton } from "./RevokeButton";
import { toastMessages } from "./messages";
import { ApiKeyValidationSchema, apiKeyValidationSchema } from "./validations";
import { ApiKey, useUpdateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { HStack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Drawer } from "tw-components";
import { fromArrayToList, toArrFromList } from "utils/string";

enum DrawerSection {
  General,
  Services,
}

interface ApiKeyDrawerProps {
  apiKey: ApiKey;
  open: boolean;
  onClose: () => void;
  onSubmit: (apiKey: ApiKey) => void;
}
export const ApiKeyDrawer: React.FC<ApiKeyDrawerProps> = ({
  apiKey,
  open,
  onClose,
  onSubmit,
}) => {
  const { id, name, domains, bundleIds, redirectUrls, services } = apiKey;
  const trackEvent = useTrack();
  const [editing, setEditing] = useState(false);
  const mutation = useUpdateApiKey();
  const [selectedSection, setSelectedSection] = useState(DrawerSection.General);
  const toast = useToast();

  const form = useForm<ApiKeyValidationSchema>({
    resolver: zodResolver(apiKeyValidationSchema),
    values: {
      name,
      domains: fromArrayToList(domains),
      bundleIds: fromArrayToList(bundleIds),
      redirectUrls: fromArrayToList(redirectUrls),
      // FIXME: Enable when wallets restrictions is in use
      // walletAddresses: fromArrayToList(walletAddresses),
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
      const formattedValues = {
        id,
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
        action: "edit",
        label: "attempt",
      });

      mutation.mutate(formattedValues, {
        onSuccess: (data) => {
          onSubmit(data);
          onSuccess();
          setEditing(false);
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
      toast(toastMessages.updateServices);
    }
  });

  const renderActions = () => {
    if (!editing) {
      return (
        <>
          <RevokeApiKeyButton id={id} name={name} onRevoke={onClose} />
          <Button colorScheme="primary" onClick={() => setEditing(true)} w={24}>
            Edit
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="outline" onClick={() => setEditing(false)}>
          Cancel
        </Button>

        <Button colorScheme="primary" onClick={handleSubmit} w={24}>
          Save
        </Button>
      </>
    );
  };

  useEffect(() => {
    setEditing(false);
  }, [apiKey]);

  return (
    <Drawer
      closeOnOverlayClick={false}
      allowPinchZoom
      preserveScrollBarGap
      onClose={onClose}
      isOpen={open}
      size="md"
      header={{ children: name }}
      footer={{
        children: (
          <HStack justifyContent="space-between" w="full">
            {renderActions()}
          </HStack>
        ),
      }}
    >
      {!editing ? (
        <ApiKeyDetails
          apiKey={apiKey}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
        />
      ) : (
        <ApiKeyForm
          form={form}
          apiKey={apiKey}
          onClose={onClose}
          onSubmit={handleSubmit}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
        />
      )}
    </Drawer>
  );
};
