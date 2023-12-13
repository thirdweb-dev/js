import {
  Box,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { NoTargetAddressesAlert } from "../Alerts";
import { ApiKeyValidationSchema, HIDDEN_SERVICES } from "../validations";

interface EditServicesProps {
  form: UseFormReturn<ApiKeyValidationSchema, any>;
}

export const EditServices: React.FC<EditServicesProps> = ({ form }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");
  const { fields, update } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const embeddedWalletIndex = fields.findIndex(
    (srv) => srv.name === "embeddedWallets",
  );
  const customAuthEndpointHeaderField = useFieldArray({
    control: form.control,
    name: `services.${embeddedWalletIndex}.customAuthEndpoint.customHeaders`,
  });

  const handleAction = (
    srvIdx: number,
    srv: FieldArrayWithId<ApiKeyValidationSchema, "services", "id">,
    actionName: string,
    checked: boolean,
  ) => {
    const actions = checked
      ? [...(srv.actions || []), actionName]
      : (srv.actions || []).filter((a) => a !== actionName);

    update(srvIdx, {
      ...srv,
      actions,
    });
  };

  return (
    <Flex flexDir="column" gap={6}>
      <Flex gap={1} flexDir="column">
        <Heading size="subtitle.md">Services</Heading>
        <Text>Choose thirdweb services this API Key is allowed to access.</Text>
      </Flex>

      <Flex flexDir="column" gap={6}>
        {fields.map((srv, idx) => {
          const service = getServiceByName(srv.name as ServiceName);

          return service ? (
            <Card
              p={{ base: 4, md: 6 }}
              bg={bg}
              key={srv.name}
              display={HIDDEN_SERVICES.includes(srv.name) ? "none" : "block"}
            >
              <HStack
                justifyContent="space-between"
                alignItems="flex-start"
                pb={4}
              >
                <Box>
                  <Heading size="label.lg" pb={1}>
                    {service.title}
                  </Heading>
                  <Text fontWeight="medium">{service.description}</Text>
                </Box>

                <Switch
                  colorScheme="primary"
                  isChecked={srv.enabled}
                  onChange={() =>
                    update(idx, {
                      ...srv,
                      enabled: !srv.enabled,
                    })
                  }
                />
              </HStack>

              {service.name === "embeddedWallets" && srv.enabled && (
                <Flex flexDir="column" gap={6}>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `services.${idx}.applicationName`,
                        form.formState,
                      ).error
                    }
                  >
                    <Box>
                      <FormLabel mt={3}>Application Name</FormLabel>
                      <Text>
                        It will show up in the emails sent to users. Defaults to
                        your API Key&apos;s name
                      </Text>
                    </Box>
                    <Input
                      disabled={!srv.enabled}
                      placeholder="Application Name"
                      type="text"
                      {...form.register(`services.${idx}.applicationName`)}
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          `services.${idx}.applicationName`,
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `services.${idx}.applicationImageUrl`,
                        form.formState,
                      ).error
                    }
                  >
                    <Box>
                      <FormLabel mt={3}>Application Image URL</FormLabel>
                      <Text>
                        It will show up in the emails sent to users. The image
                        must be squared
                      </Text>
                    </Box>
                    <Input
                      disabled={!srv.enabled}
                      placeholder="https://"
                      type="text"
                      {...form.register(`services.${idx}.applicationImageUrl`)}
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          `services.${idx}.applicationImageUrl`,
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!form.getFieldState(`redirectUrls`, form.formState).error
                    }
                  >
                    <FormLabel size="label.sm">
                      Allowed redirect URIs (native apps only)
                    </FormLabel>

                    <Textarea
                      disabled={!srv.enabled}
                      placeholder="thirdweb://"
                      {...form.register(`redirectUrls`)}
                    />
                    {!form.getFieldState(`redirectUrls`, form.formState)
                      .error ? (
                      <FormHelperText>
                        Enter redirect URIs separated by commas or new lines.
                        This is often your application&apos;s deep link.
                        Currently only used in Unity and React Native platform
                        when users authenticate through social logins.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(`redirectUrls`, form.formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `services.${idx}.customAuthentication`,
                        form.formState,
                      ).error
                    }
                  >
                    <HStack
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <FormLabel mt={3}>Custom JSON Web Token</FormLabel>
                        <Text>
                          Optionally allow users to authenticate with a custom
                          JWT.
                        </Text>
                      </Box>

                      <Switch
                        colorScheme="primary"
                        isChecked={!!srv.customAuthentication}
                        onChange={() =>
                          update(idx, {
                            ...srv,
                            customAuthentication: !srv.customAuthentication
                              ? {
                                  jwksUri: "",
                                  aud: "",
                                }
                              : undefined,
                          })
                        }
                      />
                    </HStack>
                  </FormControl>

                  {!!srv.customAuthentication && (
                    <>
                      <FormControl
                        isInvalid={
                          !!form.getFieldState(
                            `services.${idx}.customAuthentication.jwksUri`,
                            form.formState,
                          ).error
                        }
                      >
                        <FormLabel size="label.sm">JWKS URI</FormLabel>
                        <Input
                          placeholder="https://example.com/.well-known/jwks.json"
                          type="text"
                          {...form.register(
                            `services.${idx}.customAuthentication.jwksUri`,
                          )}
                        />
                        {!form.getFieldState(
                          `services.${idx}.customAuthentication.jwksUri`,
                          form.formState,
                        ).error ? (
                          <FormHelperText>
                            Enter the URI of the JWKS
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            {
                              form.getFieldState(
                                `services.${idx}.customAuthentication.jwksUri`,
                                form.formState,
                              ).error?.message
                            }
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!form.getFieldState(
                            `services.${idx}.customAuthentication.aud`,
                            form.formState,
                          ).error
                        }
                      >
                        <FormLabel size="label.sm">AUD Value</FormLabel>
                        <Input
                          placeholder="AUD"
                          type="text"
                          {...form.register(
                            `services.${idx}.customAuthentication.aud`,
                          )}
                        />
                        {!form.getFieldState(
                          `services.${idx}.customAuthentication.aud`,
                          form.formState,
                        ).error ? (
                          <FormHelperText>
                            Enter the audience claim for the JWT
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            {
                              form.getFieldState(
                                `services.${idx}.customAuthentication.aud`,
                                form.formState,
                              ).error?.message
                            }
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </>
                  )}
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `services.${idx}.customAuthentication`,
                        form.formState,
                      ).error
                    }
                  >
                    <HStack
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <FormLabel mt={3}>
                          Custom Authentication Endpoint
                        </FormLabel>
                        <Text>
                          Optionally allow users to authenticate with any
                          arbitrary payload that you provide
                        </Text>
                      </Box>

                      <Switch
                        colorScheme="primary"
                        isChecked={!!srv.customAuthEndpoint}
                        onChange={() =>
                          update(idx, {
                            ...srv,
                            customAuthEndpoint: !srv.customAuthEndpoint
                              ? {
                                  authEndpoint: "",
                                  customHeaders: [],
                                }
                              : undefined,
                          })
                        }
                      />
                    </HStack>
                  </FormControl>
                  {!!srv.customAuthEndpoint && (
                    <>
                      <FormControl
                        isInvalid={
                          !!form.getFieldState(
                            `services.${idx}.customAuthEndpoint.authEndpoint`,
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
                          {...form.register(
                            `services.${idx}.customAuthEndpoint.authEndpoint`,
                          )}
                        />
                        {!form.getFieldState(
                          `services.${idx}.customAuthEndpoint.authEndpoint`,
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
                              `services.${idx}.customAuthEndpoint.authEndpoint`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!form.getFieldState(
                            `services.${idx}.customAuthEndpoint.customHeaders`,
                            form.formState,
                          ).error
                        }
                      >
                        <FormLabel size="label.sm">Custom Headers</FormLabel>
                        <Stack gap={3} alignItems={"end"}>
                          {customAuthEndpointHeaderField.fields.map(
                            (_, customHeaderIdx) => {
                              return (
                                <Flex key={customHeaderIdx} gap={2} w="full">
                                  <Input
                                    placeholder="Key"
                                    type="text"
                                    {...form.register(
                                      `services.${idx}.customAuthEndpoint.customHeaders.${customHeaderIdx}.key`,
                                    )}
                                  />
                                  <Input
                                    placeholder="Value"
                                    type="text"
                                    {...form.register(
                                      `services.${idx}.customAuthEndpoint.customHeaders.${customHeaderIdx}.value`,
                                    )}
                                  />
                                  <IconButton
                                    aria-label="Remove header"
                                    icon={<LuTrash2 />}
                                    onClick={() => {
                                      customAuthEndpointHeaderField.remove(
                                        customHeaderIdx,
                                      );
                                    }}
                                  />
                                </Flex>
                              );
                            },
                          )}
                          <Button
                            onClick={() => {
                              customAuthEndpointHeaderField.append({
                                key: "",
                                value: "",
                              });
                            }}
                            w={
                              customAuthEndpointHeaderField.fields.length === 0
                                ? "full"
                                : "fit-content"
                            }
                          >
                            Add header
                          </Button>
                        </Stack>

                        {!form.getFieldState(
                          `services.${idx}.customAuthEndpoint.customHeaders`,
                          form.formState,
                        ).error && (
                          <FormHelperText>
                            Set custom headers to be sent along the request with
                            the payload to the authentication endpoint above.
                            You can set values to verify the incoming request
                            here.
                          </FormHelperText>
                        )}
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `services.${idx}.customAuthEndpoint.customHeaders`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </Flex>
              )}

              {service.name === "bundler" && srv.enabled && (
                <Flex flexDir="column" gap={6}>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(`services.${idx}`, form.formState)
                        .error
                    }
                  >
                    <HStack
                      alignItems="center"
                      justifyContent="space-between"
                      pb={2}
                    >
                      <FormLabel size="label.sm" mb={0}>
                        Allowed Contract addresses
                      </FormLabel>

                      <Checkbox
                        isChecked={
                          form.watch(`services.${idx}.targetAddresses`) === "*"
                        }
                        onChange={(e) => {
                          form.setValue(
                            `services.${idx}.targetAddresses`,
                            e.target.checked ? "*" : "",
                            { shouldDirty: true },
                          );
                        }}
                      >
                        <Text>Unrestricted access</Text>
                      </Checkbox>
                    </HStack>

                    <Textarea
                      disabled={!srv.enabled}
                      placeholder="0xa1234567890AbcC1234567Bb1bDa6c885b2886b6"
                      {...form.register(`services.${idx}.targetAddresses`)}
                    />
                    {!form.getFieldState(
                      `services.${idx}.targetAddresses`,
                      form.formState,
                    ).error ? (
                      <FormHelperText>
                        Enter contract addresses separated by commas or new
                        lines.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `services.${idx}.targetAddresses`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  {!form.watch(`services.${idx}.targetAddresses`) && (
                    <NoTargetAddressesAlert
                      serviceName={service.title}
                      serviceDesc={service.description}
                    />
                  )}
                </Flex>
              )}

              {service.actions.length > 0 && (
                <FormControl>
                  <HStack gap={4}>
                    {service.actions.map((sa) => (
                      <Tooltip
                        key={sa.name}
                        label={
                          <Card py={2} px={4} bgColor="backgroundHighlight">
                            <Text fontSize="small" lineHeight={6}>
                              {sa.description}
                            </Text>
                          </Card>
                        }
                        p={0}
                        bg="transparent"
                        boxShadow="none"
                      >
                        <Checkbox
                          cursor="help"
                          isChecked={srv.actions.includes(sa.name)}
                          onChange={(e) =>
                            handleAction(idx, srv, sa.name, e.target.checked)
                          }
                        >
                          <Text>{sa.title}</Text>
                        </Checkbox>
                      </Tooltip>
                    ))}
                  </HStack>
                </FormControl>
              )}
            </Card>
          ) : null;
        })}
      </Flex>
    </Flex>
  );
};
