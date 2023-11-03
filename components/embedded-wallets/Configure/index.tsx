import {
  ApiKey,
  ApiKeyService,
  useUpdateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  HStack,
  Input,
  Switch,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  ApiKeyEmbeddedWalletsValidationSchema,
  apiKeyEmbeddedWalletsValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useForm } from "react-hook-form";
import {
  Card,
  FormLabel,
  Heading,
  Text,
  FormErrorMessage,
  FormHelperText,
  Button,
} from "tw-components";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";

interface ConfigureProps {
  apiKey: ApiKey;
}

export const Configure: React.FC<ConfigureProps> = ({ apiKey }) => {
  // safe to type assert here as this component only renders
  // for an api key with an active embeddedWallets service
  const services = apiKey.services as ApiKeyService[];

  const serviceIdx = services.findIndex(
    (srv) => srv.name === "embeddedWallets",
  );
  const config = services[serviceIdx];

  const mutation = useUpdateApiKey();
  const trackEvent = useTrack();
  const toast = useToast();
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  const form = useForm<ApiKeyEmbeddedWalletsValidationSchema>({
    resolver: zodResolver(apiKeyEmbeddedWalletsValidationSchema),
    defaultValues: {
      recoveryShareManagement: config.recoveryShareManagement,
      customAuthentication: config.customAuthentication,
    },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Embedded Wallet API Key configuration updated",
    "Failed to update an API Key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const { customAuthentication, recoveryShareManagement } = values;
    const hasCustomAuth =
      recoveryShareManagement === "USER_MANAGED" &&
      (!customAuthentication?.aud.length ||
        !customAuthentication?.jwksUri.length);

    if (hasCustomAuth) {
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

    trackEvent({
      category: "embedded-wallet",
      action: "configuration-update",
      label: "attempt",
    });

    const { id, name, domains, bundleIds, redirectUrls } = apiKey;

    // FIXME: This must match components/settings/ApiKeys/Edit/index.tsx
    //        Make it more generic w/o me thinking of values
    const newServices = [...services];
    newServices[serviceIdx] = {
      ...services[serviceIdx],
      ...values,
    };

    const formattedValues = {
      id,
      name,
      domains,
      bundleIds,
      redirectUrls,
      services: newServices,
    };

    mutation.mutate(formattedValues, {
      onSuccess: () => {
        onSuccess();
        trackEvent({
          category: "embedded-wallet",
          action: "configuration-update",
          label: "success",
          data: {
            hasCustomAuth,
          },
        });
      },
      onError: (err) => {
        onError(err);
        trackEvent({
          category: "embedded-wallet",
          action: "configuration-update",
          label: "error",
          error: err,
        });
      },
    });
  });

  return (
    <Flex flexDir="column">
      <Flex flexDir="column" gap={6}>
        <Heading size="title.sm">Authentication</Heading>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          autoComplete="off"
        >
          <Flex flexDir="column" gap={8}>
            <FormControl>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <FormLabel mt={3}>Custom JSON Web Token</FormLabel>
                  <Text>
                    Optionally allow users to authenticate with a custom JWT.
                  </Text>
                </Box>

                <Switch
                  colorScheme="primary"
                  isChecked={!!form.watch("customAuthentication")}
                  onChange={() => {
                    form.setValue(
                      "recoveryShareManagement",
                      !form.watch("customAuthentication")
                        ? "USER_MANAGED"
                        : "AWS_MANAGED",
                      { shouldDirty: true },
                    );
                    form.setValue(
                      "customAuthentication",
                      !form.watch("customAuthentication")
                        ? {
                            jwksUri: "",
                            aud: "",
                          }
                        : undefined,
                      { shouldDirty: true },
                    );
                  }}
                />
              </HStack>
            </FormControl>

            {form.watch("recoveryShareManagement") === "USER_MANAGED" && (
              <Card p={6} bg={bg}>
                <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        "customAuthentication.jwksUri",
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel size="label.sm">JWKS URI</FormLabel>
                    <Input
                      placeholder="https://example.com/.well-known/jwks.json"
                      type="text"
                      {...form.register("customAuthentication.jwksUri")}
                    />
                    {!form.getFieldState(
                      "customAuthentication.jwksUri",
                      form.formState,
                    ).error ? (
                      <FormHelperText>Enter the URI of the JWKS</FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            "customAuthentication.jwksUri",
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `customAuthentication.aud`,
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel size="label.sm">AUD Value</FormLabel>
                    <Input
                      placeholder="AUD"
                      type="text"
                      {...form.register(`customAuthentication.aud`)}
                    />
                    {!form.getFieldState(
                      `customAuthentication.aud`,
                      form.formState,
                    ).error ? (
                      <FormHelperText>
                        Enter the audience claim for the JWT
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `customAuthentication.aud`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
              </Card>
            )}

            <Divider />

            <Box alignSelf="flex-end">
              <Button type="submit" colorScheme="primary">
                Save changes
              </Button>
            </Box>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};
