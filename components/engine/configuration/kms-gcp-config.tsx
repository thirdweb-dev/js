import {
  SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button, Card, FormLabel, Text } from "tw-components";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";

interface KmsGcpConfigProps {
  instance: string;
}

export const KmsGcpConfig: React.FC<KmsGcpConfigProps> = ({ instance }) => {
  const { mutate: setGcpKmsConfig } = useEngineSetWalletConfig(instance);
  const { data: gcpConfig } = useEngineWalletConfig(instance);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  const transformedQueryData: SetWalletConfigInput = {
    type: "gcp-kms" as const,
    gcpApplicationProjectId:
      gcpConfig?.type === "gcp-kms"
        ? gcpConfig?.gcpApplicationProjectId ?? ""
        : "",
    gcpKmsLocationId:
      gcpConfig?.type === "gcp-kms" ? gcpConfig?.gcpKmsLocationId ?? "" : "",
    gcpKmsKeyRingId:
      gcpConfig?.type === "gcp-kms" ? gcpConfig?.gcpKmsKeyRingId ?? "" : "",
    gcpApplicationCredentialEmail:
      gcpConfig?.type === "gcp-kms"
        ? gcpConfig?.gcpApplicationCredentialEmail ?? ""
        : "",
    gcpApplicationCredentialPrivateKey:
      gcpConfig?.type === "gcp-kms"
        ? gcpConfig?.gcpApplicationCredentialPrivateKey ?? ""
        : "",
  };

  const form = useForm<SetWalletConfigInput>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  return (
    <Flex
      as="form"
      flexDir="column"
      gap={4}
      onSubmit={form.handleSubmit((data) => {
        trackEvent({
          category: "engine",
          action: "set-wallet-config",
          type: "gcp-kms",
          label: "attempt",
        });
        setGcpKmsConfig(data, {
          onSuccess: () => {
            onSuccess();
            trackEvent({
              category: "engine",
              action: "set-wallet-config",
              type: "gcp-kms",
              label: "success",
            });
          },
          onError: (error) => {
            onError(error);
            trackEvent({
              category: "engine",
              action: "set-wallet-config",
              type: "gcp-kms",
              label: "error",
              error,
            });
          },
        });
      })}
    >
      <Card as={Flex} flexDir="column" gap={4}>
        <Text>
          Engine supports Google KMS for signing & sending transactions over any
          EVM chain.
        </Text>
        <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
          <FormControl isRequired>
            <FormLabel>Location ID</FormLabel>
            <Input
              placeholder="Your Google Location ID"
              autoComplete="off"
              type="text"
              {...form.register("gcpKmsLocationId", {
                required: true,
              })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Key Ring ID</FormLabel>
            <Input
              placeholder="Your Google Key Ring ID"
              autoComplete="off"
              type="text"
              {...form.register("gcpKmsKeyRingId", {
                required: true,
              })}
            />
          </FormControl>
        </Flex>
        <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
          <FormControl isRequired>
            <FormLabel>Project ID</FormLabel>
            <Input
              placeholder="Your Google App Project ID"
              autoComplete="off"
              type="text"
              {...form.register("gcpApplicationProjectId", { required: true })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Credential Email</FormLabel>
            <Input
              placeholder="Your Google App Credential Email"
              autoComplete="off"
              type="text"
              {...form.register("gcpApplicationCredentialEmail", {
                required: true,
              })}
            />
          </FormControl>
        </Flex>
        <FormControl isRequired>
          <FormLabel>Private Key</FormLabel>
          <Input
            w={{ base: "full", md: "49%" }}
            placeholder="Your Google App Private Key"
            autoComplete="off"
            type="text"
            {...form.register("gcpApplicationCredentialPrivateKey", {
              required: true,
            })}
          />
        </FormControl>
      </Card>
      <Flex justifyContent="end" gap={4} alignItems="center">
        {form.formState.isDirty && (
          <Text color="red.500">
            This will reset your other backend wallet configurations
          </Text>
        )}
        <Button
          isDisabled={!form.formState.isDirty}
          w={{ base: "full", md: "inherit" }}
          colorScheme="primary"
          px={12}
          type="submit"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Flex>
    </Flex>
  );
};
