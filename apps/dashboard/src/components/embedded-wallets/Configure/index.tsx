import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type ApiKey,
  type ApiKeyService,
  useAccount,
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
  Spacer,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { GatedFeature } from "components/settings/Account/Billing/GatedFeature";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
import {
  type ApiKeyEmbeddedWalletsValidationSchema,
  apiKeyEmbeddedWalletsValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
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
import { toArrFromList } from "utils/string";

interface ConfigureProps {
  apiKey: ApiKey;
  trackingCategory: string;
}

const TRACKING_CATEGORY = "embedded-wallet";

export const Configure: React.FC<ConfigureProps> = ({
  apiKey,
  trackingCategory,
}) => {
  const { data: dashboardAccount } = useAccount();
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
  const hasCustomBranding =
    !!config.applicationImageUrl?.length || !!config.applicationName?.length;

  const form = useForm<ApiKeyEmbeddedWalletsValidationSchema>({
    resolver: zodResolver(apiKeyEmbeddedWalletsValidationSchema),
    values: {
      customAuthEndpoint: config.customAuthEndpoint,
      customAuthentication: config.customAuthentication,
      ...(hasCustomBranding
        ? {
            branding: {
              applicationName: config.applicationName,
              applicationImageUrl: config.applicationImageUrl,
            },
          }
        : undefined),
      redirectUrls: apiKey.redirectUrls.join("\n"),
    },
  });

  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "customAuthEndpoint.customHeaders",
  });

  const { onSuccess, onError } = useTxNotifications(
    "In-App Wallet API Key configuration updated",
    "Failed to update an API Key",
  );

  const handleSubmit = form.handleSubmit((values) => {
    const { customAuthentication, customAuthEndpoint, branding, redirectUrls } =
      values;

    if (
      customAuthentication &&
      (!customAuthentication.aud.length || !customAuthentication.jwksUri.length)
    ) {
      return toast({
        title: "Custom JSON Web Token configuration is invalid",
        description:
          "To use In-App Wallets with Custom JSON Web Token, provide JWKS URI and AUD.",
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
          "To use In-App Wallets with Custom Authentication Endpoint, provide a valid URL.",
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

    const { id, name, domains, bundleIds } = apiKey;

    // FIXME: This must match components/settings/ApiKeys/Edit/index.tsx
    //        Make it more generic w/o me thinking of values
    const newServices = [...services];
    newServices[serviceIdx] = {
      ...services[serviceIdx],
      customAuthentication,
      customAuthEndpoint,
      applicationImageUrl: branding?.applicationImageUrl,
      applicationName: branding?.applicationName || apiKey.name,
    };

    const formattedValues = {
      id,
      name,
      domains,
      bundleIds,
      redirectUrls: toArrFromList(redirectUrls || "", true),
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
            hasCustomBranding: !!branding,
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

  if (!dashboardAccount) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Spinner className="size-4" />
      </div>
    );
  }

  return (
    <Flex flexDir="column">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        autoComplete="off"
      >
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Branding</Heading>
          <Flex flexDir="column" gap={8}>
            <FormControl>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Custom email logo and name
                  </FormLabel>
                  <Text>
                    Pass a custom logo and app name to be used in the emails
                    sent to users.
                  </Text>
                </Box>

                <GatedSwitch
                  trackingLabel="customEmailLogoAndName"
                  checked={
                    !!form.watch("branding") && dashboardAccount.advancedEnabled
                  }
                  upgradeRequired={!dashboardAccount.advancedEnabled}
                  onCheckedChange={(checked) =>
                    form.setValue(
                      "branding",
                      checked
                        ? {
                            applicationImageUrl: "",
                            applicationName: "",
                          }
                        : undefined,
                    )
                  }
                />
              </HStack>
            </FormControl>

            {!!form.watch("branding") && (
              <GatedFeature>
                <Flex flexDir="column" gap={6}>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        "branding.applicationName",
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel size="label.sm">Application Name</FormLabel>
                    <Input
                      placeholder="Application Name"
                      type="text"
                      {...form.register("branding.applicationName")}
                    />
                    {!form.getFieldState(
                      "branding.applicationName",
                      form.formState,
                    ).error ? (
                      <FormHelperText>
                        Name that will display in the emails sent to users.
                        Defaults to your API Key&apos;s name.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            "branding.applicationName",
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        "branding.applicationImageUrl",
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel size="label.sm">Application Image URL</FormLabel>
                    <Input
                      placeholder="https://"
                      type="text"
                      {...form.register("branding.applicationImageUrl")}
                    />
                    {!form.getFieldState(
                      "branding.applicationImageUrl",
                      form.formState,
                    ).error ? (
                      <FormHelperText>
                        Logo that will display in the emails sent to users. The
                        image must be squared with recommended size of 72x72 px.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            "branding.applicationImageUrl",
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
              </GatedFeature>
            )}
          </Flex>
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="title.sm">Authentication</Heading>
          <Flex flexDir="column" gap={8}>
            <FormControl>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Custom JSON Web Token
                  </FormLabel>
                  <Text>
                    Optionally allow users to authenticate with a custom JWT.{" "}
                    <TrackedLink
                      isExternal
                      href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-jwt-auth-server"
                      label="learn-more"
                      category={TRACKING_CATEGORY}
                      color="primary.500"
                    >
                      Learn more
                    </TrackedLink>
                  </Text>
                </Box>

                <GatedSwitch
                  upgradeRequired={!dashboardAccount.advancedEnabled}
                  trackingLabel="customAuthJWT"
                  checked={
                    !!form.watch("customAuthentication") &&
                    dashboardAccount.advancedEnabled
                  }
                  onCheckedChange={(checked) => {
                    form.setValue(
                      "customAuthentication",
                      checked
                        ? {
                            jwksUri: "",
                            aud: "",
                          }
                        : undefined,
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
                          "customAuthentication.aud",
                          form.formState,
                        ).error
                      }
                    >
                      <FormLabel size="label.sm">AUD Value</FormLabel>
                      <Input
                        placeholder="AUD"
                        type="text"
                        {...form.register("customAuthentication.aud")}
                      />
                      {!form.getFieldState(
                        "customAuthentication.aud",
                        form.formState,
                      ).error ? (
                        <FormHelperText>
                          Enter the audience claim for the JWT
                        </FormHelperText>
                      ) : (
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              "customAuthentication.aud",
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

            <FormControl>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Custom Authentication Endpoint
                  </FormLabel>
                  <Text>
                    Optionally allow users to authenticate with any arbitrary
                    payload that you provide.{" "}
                    <TrackedLink
                      isExternal
                      href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server"
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
                  checked={
                    !!form.watch("customAuthEndpoint") &&
                    dashboardAccount.advancedEnabled
                  }
                  upgradeRequired={!dashboardAccount.advancedEnabled}
                  onCheckedChange={(checked) => {
                    form.setValue(
                      "customAuthEndpoint",
                      checked
                        ? {
                            authEndpoint: "",
                            customHeaders: [],
                          }
                        : undefined,
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
                          "customAuthEndpoint.customHeaders",
                          form.formState,
                        ).error
                      }
                    >
                      <FormLabel size="label.sm">Custom Headers</FormLabel>
                      <Stack gap={3} alignItems={"end"}>
                        {customHeaderFields.fields.map((_, customHeaderIdx) => {
                          return (
                            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
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
                        "customAuthEndpoint.customHeaders",
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
                            "customAuthEndpoint.customHeaders",
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Card>
              </GatedFeature>
            )}
          </Flex>
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="title.sm">Native Apps</Heading>
          <Flex flexDir="column" gap={8}>
            <FormControl
              isInvalid={
                !!form.getFieldState("redirectUrls", form.formState).error
              }
            >
              <Box my={3}>
                <FormLabel>Allowed redirect URIs (native apps only)</FormLabel>
                <Text>
                  Enter redirect URIs separated by commas or new lines. This is
                  often your application&apos;s deep link.
                </Text>
              </Box>

              <Textarea
                placeholder="thirdweb://"
                {...form.register("redirectUrls")}
              />
              {!form.getFieldState("redirectUrls", form.formState).error ? (
                <FormHelperText>
                  Currently only used in Unity and React Native platform when
                  users authenticate through social logins.
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  {
                    form.getFieldState("redirectUrls", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Spacer />
          <Divider />

          <Box alignSelf="flex-end">
            <Button
              type="submit"
              colorScheme="primary"
              isLoading={mutation.isLoading}
            >
              Save changes
            </Button>
          </Box>
        </Flex>
      </form>
    </Flex>
  );
};
