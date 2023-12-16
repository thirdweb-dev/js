import {
  SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button, Card, FormLabel, Text } from "tw-components";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";

interface KmsAwsConfigProps {
  instance: string;
}

export const KmsAwsConfig: React.FC<KmsAwsConfigProps> = ({ instance }) => {
  const { mutate: setAwsKmsConfig } = useEngineSetWalletConfig(instance);
  const { data: awsConfig } = useEngineWalletConfig(instance);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  const transformedQueryData: SetWalletConfigInput = {
    type: "aws-kms" as const,
    awsAccessKeyId:
      awsConfig?.type === "aws-kms" ? awsConfig?.awsAccessKeyId ?? "" : "",
    awsSecretAccessKey: "",
    awsRegion: awsConfig?.type === "aws-kms" ? awsConfig?.awsRegion ?? "" : "",
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
        setAwsKmsConfig(data, {
          onSuccess: () => {
            onSuccess();
            trackEvent({
              category: "engine",
              action: "set-wallet-config",
              type: "aws-kms",
              label: "success",
            });
          },
          onError: (error) => {
            onError(error);
            trackEvent({
              category: "engine",
              action: "set-wallet-config",
              type: "aws-kms",
              label: "error",
              error,
            });
          },
        });
      })}
    >
      <Card as={Flex} flexDir="column" gap={4}>
        <Text>
          Engine supports AWS KWS for signing & sending transactions over any
          EVM chain.
        </Text>
        <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
          <FormControl isRequired>
            <FormLabel>Access Key</FormLabel>
            <Input
              placeholder="e.g. AKIA..."
              autoComplete="off"
              type="text"
              {...form.register("awsAccessKeyId", { required: true })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Secret Key</FormLabel>
            <Input
              placeholder="e.g. UW7A..."
              autoComplete="off"
              type="text"
              {...form.register("awsSecretAccessKey", { required: true })}
            />
          </FormControl>
        </Flex>
        <FormControl isRequired>
          <FormLabel>Region</FormLabel>
          <Input
            w={{ base: "full", md: "49%" }}
            placeholder="e.g. us-west-1"
            autoComplete="off"
            type="text"
            {...form.register("awsRegion", { required: true })}
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
