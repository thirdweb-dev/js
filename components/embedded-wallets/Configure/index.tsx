import {
  ApiKey,
  ApiKeyService,
  useUpdateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { GatedFeature } from "components/settings/Account/Billing/GatedFeature";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
import {
  ApiKeyEmbeddedWalletsValidationSchema,
  apiKeyEmbeddedWalletsValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";
import {
  Button,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";

interface ConfigureProps {
  apiKey: ApiKey;
  trackingCategory: string;
}

const TRACKING_CATEGORY = "embedded-wallet";

export const Configure: React.FC<ConfigureProps> = ({
  apiKey,
  trackingCategory,
}) => {
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
      customAuthEndpoint: config.customAuthEndpoint,
      customAuthentication: config.customAuthentication,
      applicationName: config.applicationName,
      applicationImageUrl: config.applicationImageUrl,
    },
  });
  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "customAuthEndpoint.customHeaders",
  });
  useEffect(() => {
    form.reset({
      recoveryShareManagement: config.recoveryShareManagement,
      customAuthEndpoint: config.customAuthEndpoint,
      customAuthentication: config.customAuthentication,
      applicationName: config.applicationName,
      applicationImageUrl: config.applicationImageUrl,
    });
  }, [config, form]);

  const { onSuccess, onError } = useTxNotifications(
    "Embedded Wallet API Key configuration updated",
    "Failed to update an API Key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const { customAuthentication, customAuthEndpoint } = values;

    if (
      customAuthentication &&
      (!customAuthentication.aud.length || !customAuthentication.jwksUri.length)
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

    if (customAuthEndpoint && !customAuthEndpoint.authEndpoint.length) {
      return toast({
        title: "Custom Authentication Endpoint configuration is invalid",
        description:
          "To use Embedded Wallets with Custom Authentication Endpoint, provide a valid URL.",
        position: "bottom",
        variant: "solid",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    trackEvent({
      category: trackingCategory,
      action: "configuration-update",
      label: "attempt",
    });

    const { id, name, domains, bundleIds, redirectUrls } = apiKey;

    // FIXME: This must match components/settings/ApiKeys/Edit/index.tsx
    //        Make it more generic w/o me thinking of values
    const newServices = [...services];
    newServices[serviceIdx] = {
      ...services[serviceIdx],
      customAuthentication,
      customAuthEndpoint,
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
          category: trackingCategory,
          action: "configuration-update",
          label: "success",
          data: {
            hasCustomJwt: !!customAuthentication,
            hasCustomAuthEndpoint: !!customAuthEndpoint,
          },
        });
      },
      onError: (err) => {
        onError(err);
        trackEvent({
          category: trackingCategory,
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
                    Optionally allow users to authenticate with a custom JWT.{" "}
                    <TrackedLink
                      isExternal
                      href="https://portal.thirdweb.com/wallets/embedded-wallet/custom-auth/custom-jwt-auth-server"
                      label="learn-more"
                      category={TRACKING_CATEGORY}
                      color="primary.500"
                    >
                      Learn more
                    </TrackedLink>
                  </Text>
                </Box>

                <GatedSwitch
                  trackingLabel="customAuthJWT"
                  colorScheme="primary"
                  isChecked={!!form.watch("customAuthentication")}
                  onChange={() => {
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

            {form.watch("customAuthentication") && (
              <GatedFeature>
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
                        <FormHelperText>
                          Enter the URI of the JWKS
                        </FormHelperText>
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
              </GatedFeature>
            )}

            <Divider />

            <FormControl>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <FormLabel mt={3}>Custom Authentication Endpoint</FormLabel>
                  <Text>
                    Optionally allow users to authenticate with any arbitrary
                    payload that you provide.{" "}
                    <TrackedLink
                      isExternal
                      href="https://portal.thirdweb.com/wallets/embedded-wallet/custom-auth/custom-auth-server"
                      label="learn-more"
                      category={TRACKING_CATEGORY}
                      color="primary.500"
                    >
                      Learn more
                    </TrackedLink>
                  </Text>
                </Box>

                <GatedSwitch
                  trackingLabel="customAuthEndpoint"
                  colorScheme="primary"
                  isChecked={!!form.watch("customAuthEndpoint")}
                  onChange={() => {
                    form.setValue(
                      "customAuthEndpoint",
                      !form.watch("customAuthEndpoint")
                        ? {
                            authEndpoint: "",
                            customHeaders: [],
                          }
                        : undefined,
                      { shouldDirty: true },
                    );
                  }}
                />
              </HStack>
            </FormControl>

            {form.watch("customAuthEndpoint") && (
              <GatedFeature>
                <Card p={6} bg={bg}>
                  <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
                    <FormControl
                      isInvalid={
                        !!form.getFieldState(
                          "customAuthEndpoint.authEndpoint",
                          form.formState,
                        ).error
                      }
                    >
                      <FormLabel size="label.sm">
                        Authentication Endpoint
                      </FormLabel>
                      <Input
                        placeholder="https://example.com/your-auth-verifier"
                        type="text"
                        {...form.register("customAuthEndpoint.authEndpoint")}
                      />
                      {!form.getFieldState(
                        "customAuthEndpoint.authEndpoint",
                        form.formState,
                      ).error && (
                        <FormHelperText>
                          Enter the URL of your server where we will send the
                          user payload for verification
                        </FormHelperText>
                      )}
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            "customAuthEndpoint.authEndpoint",
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        !!form.getFieldState(
                          `customAuthEndpoint.customHeaders`,
                          form.formState,
                        ).error
                      }
                    >
                      <FormLabel size="label.sm">Custom Headers</FormLabel>
                      <Stack gap={3} alignItems={"end"}>
                        {customHeaderFields.fields.map((_, customHeaderIdx) => {
                          return (
                            <Flex key={customHeaderIdx} gap={2} w="full">
                              <Input
                                placeholder="Key"
                                type="text"
                                {...form.register(
                                  `customAuthEndpoint.customHeaders.${customHeaderIdx}.key`,
                                )}
                              />
                              <Input
                                placeholder="Value"
                                type="text"
                                {...form.register(
                                  `customAuthEndpoint.customHeaders.${customHeaderIdx}.value`,
                                )}
                              />
                              <IconButton
                                aria-label="Remove header"
                                icon={<LuTrash2 />}
                                onClick={() => {
                                  customHeaderFields.remove(customHeaderIdx);
                                }}
                              />
                            </Flex>
                          );
                        })}
                        <Button
                          onClick={() => {
                            customHeaderFields.append({
                              key: "",
                              value: "",
                            });
                          }}
                          w={
                            customHeaderFields.fields.length === 0
                              ? "full"
                              : "fit-content"
                          }
                        >
                          Add header
                        </Button>
                      </Stack>

                      {!form.getFieldState(
                        `customAuthEndpoint.customHeaders`,
                        form.formState,
                      ).error && (
                        <FormHelperText>
                          Set custom headers to be sent along the request with
                          the payload to the authentication endpoint above. You
                          can set values to verify the incoming request here.
                        </FormHelperText>
                      )}
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `customAuthEndpoint.customHeaders`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Card>
              </GatedFeature>
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
